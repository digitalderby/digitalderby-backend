import mongoose, { Types } from 'mongoose';
import {
  randRange,
  randomIndicesNoReplacement,
  rollDiceDropLowest,
} from '../random/random.js';
import { HORSE_POPULATION } from '../config/globalsettings.js';
import { User } from './User.js';
import GameLog from './GameLog.js';

const firstNames = [
  'Dashing',
  'Blazing',
  'Swift',
  'Shocking',
  'Galloping',
  'Great',
  'Super',
  'Ultra',
  'Mega',
  'Extreme',
];

const secondNames = [
  'Stallion',
  'Thunderhoof',
  'Nightshade',
  'Raven',
  'Thunder',
  'Wake',
  'Blue',
  'Red',
  'Sprinter',
  'Glider',
  'Pegasus',
  'Shadow',
  'Flash',
  'Spirit',
  'Silver',
  'Gold',
  'Lightning',

  'Will',
  'Lando',
  'Fergus',
  'Adonis',
  'Addy',
  'Josh',
  'Erika',
  'Alexa',
  'Ian',
  'Aris',
  'JP',
];

const colors = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Blue',
  'Purple',
  'Black',
  'Brown',
  'Mocha',
  'Amber',
  'Gold',
  'Ebony',
  'Ivory',
];

const firstIcons = ['✨', '🔥', '💨', '☄️', '💦', '💕', '🫧'];

const secondIcons = [
  '⭐',
  '🌟',
  '🌩️',
  '⚡',
  '💡',
  '⚙️',
  '🤖',
  '👽',
  '👾',
  '🚀',
  '💰',
  '💥',
  '☢️',
  '💯',
  '🕶️',
  '☀️',
  '🪐',
  '🍔',
  '🦁',
  '🎲',
  '❤️',
];

interface IHorseStats {
  topSpeed: number;
  stamina: number;
  acceleration: number;
}

export interface IHorse {
  name: string;
  icons: string[];
  color: string;
  stats: IHorseStats;
}

const horseStatsSchema = new mongoose.Schema<IHorseStats>({
  topSpeed: {
    type: Number,
    required: true,
  },
  stamina: {
    type: Number,
    required: true,
  },
  acceleration: {
    type: Number,
    required: true,
  },
});

const horseSchema = new mongoose.Schema<IHorse>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icons: [
      {
        type: String,
      },
    ],
    color: {
      type: String,
      required: true,
    },
    stats: {
      type: horseStatsSchema,
      required: true,
    },
  },
  { timestamps: true },
);

export function generateNewHorses(): IHorse[] {
  // Generate names and icon lists, ensuring that they are both unique
  const icons: string[][] = [];
  const names: string[] = [];

  while (icons.length < HORSE_POPULATION) {
    let newIcon = [secondIcons[randRange(0, secondIcons.length - 1)]];
    if (Math.random() < 1 / 8) {
      newIcon = [firstIcons[randRange(0, firstIcons.length - 1)], ...newIcon];
    }

    if (
      icons.some((ic) => {
        if (ic.length !== newIcon.length) {
          return false;
        }

        for (let j = 0; j < ic.length; j++) {
          if (ic[j] !== newIcon[j]) {
            return false;
          }
        }

        return true;
      })
    ) {
      continue;
    }

    icons.push(newIcon);
  }

  while (names.length < HORSE_POPULATION) {
    const randomFirstName = firstNames[randRange(0, firstNames.length - 1)];
    const randomSecondName = secondNames[randRange(0, secondNames.length - 1)];
    const name = `${randomFirstName} ${randomSecondName}`;

    if (names.includes(name)) {
      continue;
    }
    names.push(name);
  }

  return Array.from({ length: HORSE_POPULATION }, (_, i) => {
    const randomColor = colors[randRange(0, colors.length - 1)];
    return {
      name: names[i],
      icons: [...icons[i], '🐎'],
      color: randomColor,
      stats: {
        topSpeed: rollDiceDropLowest(6, 4, 3),
        stamina: rollDiceDropLowest(6, 4, 3),
        acceleration: rollDiceDropLowest(6, 4, 3),
      },
    };
  });
}

export type HorseSpec = IHorse & { _id: Types.ObjectId };

export const Horse = mongoose.model('Horse', horseSchema);
