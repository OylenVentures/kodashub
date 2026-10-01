/** Generic shape of a Blesta API error response body. */
export interface BlestaErrorResponse {
  message?: string;
  errors?: Record<string, Record<string, string>>;
}

/** A Blesta client record (subset of fields we actually use). */
export interface BlestaClient {
  id: number;
  id_code: string;
  email: string;
  status: string;
}

/** A Blesta service record (subset). A purchased/registered domain is a "service". */
export interface BlestaService {
  id: number;
  client_id: number;
  package_id: number;
  pricing_id: number;
  status: string; // pending, active, canceled, suspended, in_review
  date_added: string;
  date_renews: string | null;
  fields: Array<{ key: string; value: string; encrypted: boolean }>;
}

export interface BlestaPricing {
  id: number;
  term: number;
  period: 'day' | 'week' | 'month' | 'year' | 'onetime';
  price: number;
  currency: string;
}
