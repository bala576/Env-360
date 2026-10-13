import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownOption } from '../../shared/dropdown/dropdown';
import {
  ALL_MODULES,
  FEATURED,
  HOW_IT_WORKS,
  MODULE_TONES,
  QUICK_DEPLOY,
  SITES,
  SolutionTemplate,
  TEMPLATES,
  TPL_ICONS,
  TPL_TABS,
} from './solutiontemplete.data';

interface Deployment {
  template: SolutionTemplate;
  sites: string[];
}

const distinct = (values: string[]) => [...new Set(values)].sort();
// Card columns per breakpoint; keep in sync with the .groups media queries in the stylesheet
const columnsFor = (width: number) => (width <= 600 ? 1 : width <= 900 ? 2 : width <= 1500 ? 3 : 4);
const options = (all: string, values: string[]): DropdownOption[] => [{ label: all, value: 'all' }, ...values.map(v => ({ label: v, value: v }))];

@Component({
  selector: 'app-solutiontemplete',
  imports: [CommonModule, FormsModule, Dropdown],
  templateUrl: './solutiontemplete.html',
  styleUrl: './solutiontemplete.css',
})
export class Solutiontemplete implements OnDestroy {

  icons = TPL_ICONS;
  tabs = TPL_TABS;
  activeTab = TPL_TABS[0];
  featured = FEATURED;
  howItWorks = HOW_IT_WORKS;
  quickDeploy = QUICK_DEPLOY;
  sites = SITES;
  allModules = ALL_MODULES;
  Math = Math;

  customTemplates: SolutionTemplate[] = [];
  deployments: Deployment[] = [];

  ngOnDestroy(): void {
    clearTimeout(this.toastTimer);
  }

  tagTone(module: string): string {
    return 'tag-' + (MODULE_TONES[module] ?? 'default');
  }

  // ---------- Filters ----------
  industry = 'all';
  useCase = 'all';
  technology = 'all';
  application = 'all';
  search = '';

  private get library(): SolutionTemplate[] {
    return [...TEMPLATES, ...this.customTemplates];
  }

  industryOptions = options('All Industries', distinct(TEMPLATES.map(t => t.industry)));
  useCaseOptions = options('All Use Cases', distinct(TEMPLATES.flatMap(t => t.useCases)));
  technologyOptions = options('All Technologies', distinct(TEMPLATES.flatMap(t => t.technologies)));
  applicationOptions = options('All Applications', distinct(TEMPLATES.flatMap(t => t.modules)));

  get filterCount(): number {
    return [this.industry, this.useCase, this.technology, this.application].filter(v => v !== 'all').length + (this.search.trim() ? 1 : 0);
  }

  clearFilters(): void {
    this.industry = this.useCase = this.technology = this.application = 'all';
    this.search = '';
  }

  private matches(t: SolutionTemplate): boolean {
    const q = this.search.trim().toLowerCase();
    return (this.industry === 'all' || t.industry === this.industry) &&
      (this.useCase === 'all' || t.useCases.includes(this.useCase)) &&
      (this.technology === 'all' || t.technologies.includes(this.technology)) &&
      (this.application === 'all' || t.modules.includes(this.application)) &&
      (!q || [t.name, t.description, t.industry, ...t.modules, ...t.useCases].some(s => s.toLowerCase().includes(q)));
  }

  // Cards for the active tab: one flat list, or grouped by industry / use case
  get groups(): { title: string; items: SolutionTemplate[] }[] {
    if (this.activeTab === 'My Templates') {
      return [{ title: '', items: this.myTemplates.filter(t => this.matches(t)) }];
    }
    const items = this.library.filter(t => this.matches(t));
    if (this.activeTab === 'By Industry') {
      return distinct(items.map(t => t.industry)).map(title => ({ title, items: items.filter(t => t.industry === title) }));
    }
    if (this.activeTab === 'By Use Case') {
      return distinct(items.flatMap(t => t.useCases)).map(title => ({ title, items: items.filter(t => t.useCases.includes(title)) }));
    }
    return [{ title: '', items }];
  }

  // Custom templates first, then each deployed library template once
  get myTemplates(): SolutionTemplate[] {
    const deployed = this.deployments.map(d => d.template).filter(t => !t.custom);
    return [...this.customTemplates, ...deployed.filter((t, i) => deployed.findIndex(o => o.key === t.key) === i)];
  }

  // Grouped tabs show one row per group so no row is left half empty; the rest expands on demand
  maxCols = columnsFor(window.innerWidth);
  expandedGroups = new Set<string>();

  visibleItems(group: { title: string; items: SolutionTemplate[] }): SolutionTemplate[] {
    return !group.title || this.expandedGroups.has(group.title) ? group.items : group.items.slice(0, this.maxCols);
  }

  toggleGroup(title: string): void {
    this.toggle(this.expandedGroups, title);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.maxCols = columnsFor(window.innerWidth);
  }

  get resultCount(): number {
    return new Set(this.groups.flatMap(g => g.items)).size;
  }

  deployedSites(t: SolutionTemplate): string[] {
    return distinct(this.deployments.filter(d => d.template.key === t.key).flatMap(d => d.sites));
  }

  // ---------- Deploy dialog ----------
  dialog: 'deploy' | 'create' | null = null;
  target: SolutionTemplate | null = null;
  // 0 configure, 1 choose sites, 2 deployed
  step = 0;
  chosenSites = new Set<string>([SITES[0]]);
  chosenModules = new Set<string>();

  openDeploy(t: SolutionTemplate): void {
    this.target = t;
    this.chosenModules = new Set(t.modules);
    this.chosenSites = new Set([SITES[0]]);
    this.step = 0;
    this.dialog = 'deploy';
  }

  // The featured Smart Mall bundle deploys like any other template
  openFeatured(): void {
    this.openDeploy({
      key: 'mall', name: FEATURED.name, icon: 'bag', color: '#6d28d9', tint: '#ede9fe', industry: 'Retail', art: 'retail',
      description: FEATURED.description, modules: FEATURED.modules, useCases: ['Occupancy', 'Customer Experience'],
      technologies: ['People Counters', 'Bay Sensors', 'Digital Signage', 'IoT Sensors'],
    });
  }

  toggle(set: Set<string>, value: string): void {
    set.has(value) ? set.delete(value) : set.add(value);
  }

  // Step shown as active in the Quick Deploy strip while the dialog is open
  get quickStep(): number {
    if (this.dialog !== 'deploy') return -1;
    return this.step + 1;
  }

  deploy(): void {
    if (!this.target || this.chosenSites.size === 0) return;
    this.deployments.push({ template: this.target, sites: [...this.chosenSites] });
    this.step = 2;
    this.notify(`${this.target.name} deployed to ${this.chosenSites.size} site${this.chosenSites.size === 1 ? '' : 's'}`);
  }

  // ---------- Create custom template ----------
  draftName = '';
  draftIndustry = 'Retail';
  draftDescription = '';
  draftIndustryOptions = TEMPLATES.map(t => t.industry).filter((v, i, a) => a.indexOf(v) === i).map(v => ({ label: v, value: v }));

  openCreate(): void {
    this.draftName = '';
    this.draftDescription = '';
    this.draftIndustry = 'Retail';
    this.chosenModules = new Set(['Space & Occupancy', 'Environment Monitoring']);
    this.dialog = 'create';
  }

  get canCreate(): boolean {
    return this.draftName.trim().length > 1 && this.chosenModules.size > 0;
  }

  createTemplate(): void {
    if (!this.canCreate) return;
    const name = this.draftName.trim();
    this.customTemplates.unshift({
      key: `custom-${Date.now()}`, name, icon: 'star', color: '#6d28d9', tint: '#ede9fe', industry: this.draftIndustry, art: 'custom', custom: true,
      description: this.draftDescription.trim() || `Custom ${this.draftIndustry.toLowerCase()} template.`,
      modules: ALL_MODULES.filter(m => this.chosenModules.has(m)),
      useCases: [], technologies: [],
    });
    this.dialog = null;
    this.activeTab = 'My Templates';
    this.notify(`${name} saved to My Templates`);
  }

  closeDialog(): void {
    this.dialog = null;
  }

  // ---------- Toast ----------
  toast = '';
  private toastTimer?: ReturnType<typeof setTimeout>;

  private notify(message: string): void {
    this.toast = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 2800);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.dialog = null;
  }
}
