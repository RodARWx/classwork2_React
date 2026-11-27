/**
 * Unit conversion definitions matching Samsung Calculator's Unit Converter.
 */

export const CONVERTER_CATEGORIES = {
  Time: {
    label: 'Time',
    units: {
      Milliseconds: 0.001,
      Seconds: 1,
      Minutes: 60,
      Hours: 3600,
      Days: 86400,
      Weeks: 604800,
    },
    defaultFrom: 'Milliseconds',
    defaultTo: 'Minutes',
  },
  Mass: {
    label: 'Mass',
    units: {
      Milligrams: 0.001,
      Grams: 1,
      Kilograms: 1000,
      Pounds: 453.59237,
      Ounces: 28.34952,
    },
    defaultFrom: 'Kilograms',
    defaultTo: 'Pounds',
  },
  Length: {
    label: 'Length',
    units: {
      Millimeters: 0.001,
      Centimeters: 0.01,
      Meters: 1,
      Kilometers: 1000,
      Inches: 0.0254,
      Feet: 0.3048,
      Miles: 1609.344,
    },
    defaultFrom: 'Meters',
    defaultTo: 'Feet',
  },
  Data: {
    label: 'Data',
    units: {
      Bytes: 1,
      Kilobytes: 1024,
      Megabytes: 1024 ** 2,
      Gigabytes: 1024 ** 3,
      Terabytes: 1024 ** 4,
    },
    defaultFrom: 'Gigabytes',
    defaultTo: 'Megabytes',
  },
  Speed: {
    label: 'Speed',
    units: {
      'm/s': 1,
      'km/h': 1 / 3.6,
      mph: 0.44704,
      knots: 0.514444,
    },
    defaultFrom: 'km/h',
    defaultTo: 'm/s',
  },
  Volume: {
    label: 'Volume',
    units: {
      Milliliters: 0.001,
      Liters: 1,
      'Cubic meters': 1000,
      Gallons: 3.78541,
      Cups: 0.236588,
    },
    defaultFrom: 'Liters',
    defaultTo: 'Gallons',
  },
};

export function convertUnit(value, categoryKey, fromUnit, toUnit) {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return '0';
  const category = CONVERTER_CATEGORIES[categoryKey];
  if (!category) return '0';

  const baseValue = num * category.units[fromUnit];
  const converted = baseValue / category.units[toUnit];
  const rounded = Math.round(converted * 1e6) / 1e6;
  return String(rounded);
}
