interface ModifyDonor {
  uuid: string;
  user: string;
}

export interface ModifyDonorAddress extends ModifyDonor {
  addressLineOne: string;
  addressLineTwo?: string;
  city: string;
  state?: string;
  zipCode?: string;
  zipCodeExt?: string;
}

export interface ModifyDonorEmail extends ModifyDonor {
  email: string;
}

export interface ModifyDonorWorkPhone extends ModifyDonor {
  workPhone: string;
  workPhoneExt?: string;
  workCall?: string;
}

export interface ModifyDonorHomePhone extends ModifyDonor {
  homePhone: string;
  homeCall?: string;
}

export interface ModifyDonorCellPhone extends ModifyDonor {
  cellPhone: string;
  cellCall?: string;
  cellText?: string;
}
