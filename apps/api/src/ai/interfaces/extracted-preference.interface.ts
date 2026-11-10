export interface ExtractedPreference {
  attribute: string;
  normalizedValue: string;
  originalWording: string;
  category:
    | "relationship_intention"
    | "values_lifestyle"
    | "personal_preferences"
    | "long_term_ambitions"
    | "interests"
    | "other";
  priority: "non_negotiable" | "strong" | "nice_to_have";
  confidence: number;
}
