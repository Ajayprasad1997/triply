import { AgencyPartner, TravelPackage } from '../types';

const COUNTRY_RULES = [
  { country: 'United Arab Emirates', aliases: ['united arab emirates', 'uae'], region: 'Middle East' },
  { country: 'India', aliases: ['india'], region: 'India' },
  { country: 'Indonesia', aliases: ['indonesia'], region: 'Asia' },
  { country: 'Switzerland', aliases: ['switzerland', 'swiss'], region: 'Europe' },
  { country: 'Maldives', aliases: ['maldives'], region: 'Island Getaways' },
  { country: 'Thailand', aliases: ['thailand'], region: 'Asia' },
  { country: 'Japan', aliases: ['japan'], region: 'Asia' },
  { country: 'Greece', aliases: ['greece'], region: 'Europe' },
  { country: 'Italy', aliases: ['italy'], region: 'Europe' },
  { country: 'Oman', aliases: ['oman'], region: 'Middle East' }
] as const;

export interface PackageLocation {
  country: string;
  place: string;
  label: string;
  key: string;
  region: string;
}

export const getPackageLocation = (pkg: TravelPackage, agency?: AgencyPartner): PackageLocation => {
  const source = `${pkg.destination} ${agency?.location || ''}`.toLowerCase();
  const rule = COUNTRY_RULES.find(item => item.aliases.some(alias => source.includes(alias)));
  const country = rule?.country || agency?.location?.split(',').pop()?.trim() || 'Other';

  let place = pkg.destination.trim();
  if (rule) {
    for (const alias of rule.aliases) {
      place = place.replace(new RegExp(`\\b${alias.replace(/\s+/g, '\\s+')}\\b`, 'ig'), '');
    }
  }
  place = place.replace(/^[\s,&-]+|[\s,&-]+$/g, '').replace(/\s{2,}/g, ' ').trim();
  if (!place) place = pkg.destination.trim() || country;

  const key = `${country}::${place}`.toLowerCase();
  return { country, place, label: `${country} — ${place}`, key, region: rule?.region || 'Other' };
};
