// Startup Stage options for the new registration flow
export type StartupStageOption = {
  value: string;
  viewValue: string;
};

export const STARTUP_STAGE_OPTIONS: StartupStageOption[] = [
  { value: 'private', viewValue: 'Private Limited Company' },
  { value: 'public', viewValue: 'Private Limited Company' },
  { value: 'partnerships', viewValue: 'Partnerships Company' },
  { value: 'limited', viewValue: 'Limited Liability Partnership' },
  { value: 'one', viewValue: 'One Person Company' },
  { value: 'sole', viewValue: 'Sole Proprietorship' },
  { value: 'sec8', viewValue: 'Section 8 Company' },
  { value: 'other', viewValue: 'Other' },
];
