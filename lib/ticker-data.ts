import { getTickerMessagesFromCSV } from './ticker-csv';

export interface TickerItem {
  id: string;
  text: string;
  emoji: string;
}

/**
 * Fetches ticker items from dedicated ticker CSV
 */
async function getTickerItemsFromCSV(): Promise<TickerItem[]> {
  try {
    const messages = await getTickerMessagesFromCSV();
    
    if (!messages || messages.length === 0) {
      return [];
    }

    // Convert messages to ticker items
    return messages.map(msg => ({
      id: `ticker-${msg.id}`,
      text: msg.message,
      emoji: '✨', // Default emoji for ticker messages
    }));
  } catch (error) {
    console.error('Error fetching ticker messages:', error);
    return [];
  }
}

/**
 * Gets all ticker data from CSV only
 */
export async function getTickerData(): Promise<TickerItem[]> {
  const tickerItems = await getTickerItemsFromCSV();
  return tickerItems;
}
