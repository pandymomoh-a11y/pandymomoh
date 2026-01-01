
export interface EggProductionEntry {
  birdType: string;
  totalEggs: number;
  crackedEggs: number;
}

export interface EggProductionReport {
  entries: EggProductionEntry[];
}

export interface MortalityEntry {
  birdType: string;
  numberDead: number;
}

export interface MortalityReport {
  entries: MortalityEntry[];
}

export interface FeedStockEntry {
  feedType: string;
  opening: number;
  used: number;
  bought: number;
}

export interface FeedStockReport {
  entries: FeedStockEntry[];
}

export interface EggSaleEntry {
  eggType: string;
  opening: number;
  sold: number;
}

export interface EggSalesReport {
  entries: EggSaleEntry[];
}

export interface DailyReport {
  date: string;
  eggProduction: EggProductionReport;
  mortality: MortalityReport;
  feedStock: FeedStockReport;
  eggSales: EggSalesReport;
}

export interface UserProfile {
  id: string;
  name: string;
}
