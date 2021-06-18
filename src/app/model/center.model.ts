export interface CenterModel {
  "center_id": string;
  "name": string;
  "name_l": string;
  "address": string;
  "address_l": string;
  "state_name": string;
  "state_name_l": string;
  "district_name": string;
  "district_name_l": string;
  "block_name": string;
  "block_name_l": string;
  "pincode": string;
  "lat": number;
  "long": number;
  "from": string;
  "to": string;
  "fee_type": string;
  "vaccine_fees": Array<Object>;
  "sessions": Array<SessionModel>;
}

export interface SessionModel {
  "session_id": string;
  "date": string;
  "available_capacity": number;
  "available_capacity_dose1": number;
  "available_capacity_dose2": number;
  "min_age_limit": number;
  "vaccine": string;
  "slots": Array<string>;
}
