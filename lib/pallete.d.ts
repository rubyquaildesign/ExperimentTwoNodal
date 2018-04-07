// Type definitions for [Pallete] [~OPTIONAL VERSION NUMBER~]
// Project: [Pallete]
// Definitions by: [Rupert] <[~A URL FOR YOU~]>

declare namespace Pallete {
  interface Pcol {
    red: number;
    alpha: number;
    name: string;
    blue: number;
    green: number;
    hex: string;
  }
  //~ We can write 'myLib.timeout = 50;'
  const cools: Pallete.Pcol[];
  const warms: Pallete.Pcol[];
  const neutrals: Pallete.Pcol[];
  const reds: Pallete.Pcol[];
  const apricots: Pallete.Pcol[];
  const oranges: Pallete.Pcol[];
  const browns: Pallete.Pcol[];
  const yellows: Pallete.Pcol[];
  const limes: Pallete.Pcol[];
  const greens: Pallete.Pcol[];
  const aquas: Pallete.Pcol[];
  const blues: Pallete.Pcol[];
  const violets: Pallete.Pcol[];
  const purples: Pallete.Pcol[];
  const pinks: Pallete.Pcol[];
}
