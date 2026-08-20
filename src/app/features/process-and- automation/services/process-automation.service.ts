import { Injectable } from '@angular/core';

export interface ProcessAutomationRulePayload {
  title: string;
  relationship: string;
  conditions: unknown[];
  setTimePeriod: boolean;
  actions: unknown[];
}

@Injectable()
export class ProcessAutomationService {

  private rules: ProcessAutomationRulePayload[] = [];

  addRule(payload: ProcessAutomationRulePayload): void {
    this.rules.push(payload);
  }

  getRules(): ProcessAutomationRulePayload[] {
    return this.rules;
  }
}
