import agreements from "./agreements";
import donations from "./donations";
import profile from "./profile";
import tax from "./tax";

export const dashboardpages = [donations, agreements, profile, tax] as const;
