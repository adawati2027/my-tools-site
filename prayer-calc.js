// Client-side prayer-time fallback used only when the Aladhan API is unreachable.
// Calculation engine: self-hosted vendor/praytime-3.2.js (praytimes.org, MIT).
// Method parameters (fajr/isha angles) verified 2026-09-25 against Aladhan's own
// live /v1/methods endpoint so fallback output matches the primary source.
// 'Gulf' is not a built-in praytime.js method (Oman/UAE use Aladhan method 8,
// "Gulf Region": Fajr 19.5°, Isha 90 min after Maghrib) so it's set explicitly.

const PRAYER_CITY_DATA = {
  Jordan: {
    method: 'Egypt',
    cities: {
      Amman:     { lat: 31.9539, lng: 35.9106, tz: 'Asia/Amman' },
      Irbid:     { lat: 32.5556, lng: 35.8500, tz: 'Asia/Amman' },
      Zarqa:     { lat: 32.0728, lng: 36.0876, tz: 'Asia/Amman' },
      Aqaba:     { lat: 29.5321, lng: 35.0063, tz: 'Asia/Amman' },
      'As-Salt': { lat: 32.0389, lng: 35.7269, tz: 'Asia/Amman' },
      Karak:     { lat: 31.1854, lng: 35.7047, tz: 'Asia/Amman' },
      Mafraq:    { lat: 32.3431, lng: 36.2081, tz: 'Asia/Amman' },
      Jerash:    { lat: 32.2811, lng: 35.8994, tz: 'Asia/Amman' },
      Ajloun:    { lat: 32.3325, lng: 35.7517, tz: 'Asia/Amman' },
      Madaba:    { lat: 31.7167, lng: 35.7944, tz: 'Asia/Amman' },
      "Ma'an":   { lat: 30.1962, lng: 35.7343, tz: 'Asia/Amman' },
      Tafilah:   { lat: 30.8373, lng: 35.6044, tz: 'Asia/Amman' },
    }
  },
  Oman: {
    method: 'Gulf',
    cities: {
      Muscat:  { lat: 23.5880, lng: 58.3829, tz: 'Asia/Muscat' },
      Salalah: { lat: 17.0151, lng: 54.0924, tz: 'Asia/Muscat' },
      Sohar:   { lat: 24.3473, lng: 56.7089, tz: 'Asia/Muscat' },
      Nizwa:   { lat: 22.9333, lng: 57.5333, tz: 'Asia/Muscat' },
      Sur:     { lat: 22.5667, lng: 59.5289, tz: 'Asia/Muscat' },
    }
  },
  'United Arab Emirates': {
    method: 'Gulf',
    cities: {
      Dubai:        { lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
      'Abu%20Dhabi': { lat: 24.4539, lng: 54.3773, tz: 'Asia/Dubai' },
      Sharjah:      { lat: 25.3463, lng: 55.4209, tz: 'Asia/Dubai' },
      'Al%20Ain':   { lat: 24.2075, lng: 55.7447, tz: 'Asia/Dubai' },
      Fujairah:     { lat: 25.1288, lng: 56.3265, tz: 'Asia/Dubai' },
    }
  },
  'Saudi Arabia': {
    method: 'Makkah',
    cities: {
      Riyadh:  { lat: 24.7136, lng: 46.6753, tz: 'Asia/Riyadh' },
      Jeddah:  { lat: 21.4858, lng: 39.1925, tz: 'Asia/Riyadh' },
      Mecca:   { lat: 21.4225, lng: 39.8262, tz: 'Asia/Riyadh' },
      Medina:  { lat: 24.5247, lng: 39.5692, tz: 'Asia/Riyadh' },
      Dammam:  { lat: 26.4207, lng: 50.0888, tz: 'Asia/Riyadh' },
    }
  },
  'United Kingdom': {
    method: 'MWL',
    cities: {
      London:     { lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
      Manchester: { lat: 53.4808, lng: -2.2426, tz: 'Europe/London' },
      Birmingham: { lat: 52.4862, lng: -1.8904, tz: 'Europe/London' },
      Edinburgh:  { lat: 55.9533, lng: -3.1883, tz: 'Europe/London' },
      Glasgow:    { lat: 55.8642, lng: -4.2518, tz: 'Europe/London' },
    }
  },
  'United States': {
    method: 'ISNA',
    cities: {
      'New%20York':    { lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
      'Los%20Angeles': { lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles' },
      Chicago:         { lat: 41.8781, lng: -87.6298, tz: 'America/Chicago' },
      Houston:         { lat: 29.7604, lng: -95.3698, tz: 'America/Chicago' },
      Miami:           { lat: 25.7617, lng: -80.1918, tz: 'America/New_York' },
    }
  },
};

function ptLocalDateParts(tz) {
  const s = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const [y, m, d] = s.split('-').map(Number);
  return { y, m, d };
}

function getLocalPrayerTimes(country, city) {
  const countryData = PRAYER_CITY_DATA[country];
  if (!countryData) throw new Error('Unknown country: ' + country);
  const loc = countryData.cities[city];
  if (!loc) throw new Error('Unknown city: ' + city);

  const pt = new PrayTime(countryData.method === 'Gulf' ? 'MWL' : countryData.method);
  if (countryData.method === 'Gulf') pt.adjust({ fajr: 19.5, isha: '90 min' });
  pt.location([loc.lat, loc.lng]).timezone(loc.tz).format('24h');

  const { y, m, d } = ptLocalDateParts(loc.tz);
  const t = pt.times([y, m, d]);
  return {
    Fajr: t.fajr, Sunrise: t.sunrise, Dhuhr: t.dhuhr,
    Asr: t.asr, Maghrib: t.maghrib, Isha: t.isha,
    year: y, month: m, day: d
  };
}
