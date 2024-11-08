import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LineChart, type TLineChartDataProp } from "react-native-wagmi-charts";

// Types
type Candle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

// Constants
const FAKE_CANDLES_LENGTH = 50;
const UPDATE_INTERVAL = 1000; // 1 second

// Utility functions
const generateFakeCandle = (previousCandle?: Candle): Candle => {
  const now = Date.now();
  const basePrice = previousCandle?.close || 100;
  const change = (Math.random() - 0.5) * 5;
  const close = basePrice + change;
  
  return {
    timestamp: now,
    open: basePrice,
    high: Math.max(basePrice, close) + Math.random() * 2,
    low: Math.min(basePrice, close) - Math.random() * 2,
    close,
  };
};

const makeLineData = (candles: Candle[]): TLineChartDataProp =>
  candles.map((candle) => ({
    timestamp: candle.timestamp,
    value: candle.close,
  }));

// Hooks
const useFakeCandles = () => {
  const [fakeCandles, setFakeCandles] = useState<Candle[]>([]);
  
  useEffect(() => {
    const initialCandles: Candle[] = [];
    let lastCandle;
    
    for (let i = 0; i < FAKE_CANDLES_LENGTH; i++) {
      lastCandle = generateFakeCandle(lastCandle);
      initialCandles.push(lastCandle);
    }
    
    setFakeCandles(initialCandles);
    
    const interval = setInterval(() => {
      setFakeCandles(prevCandles => {
        const newCandle = generateFakeCandle(prevCandles[prevCandles.length - 1]);
        return [...prevCandles.slice(1), newCandle];
      });
    }, UPDATE_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);
  
  return fakeCandles;
};

// Main component
export default function HomeScreen() {
  const candles = useFakeCandles();
  const lineData: TLineChartDataProp = useMemo(() => makeLineData(candles), [candles]);

  useEffect(() => {
    return () => {
      console.log('unmounted');
    };
  }, []);
  
  if (lineData.length === 0) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <LineChart.Provider data={lineData}>
        <View>
          <LineChart>
            <LineChart.Path color="black" />
            <LineChart.CursorCrosshair color="black" />
          </LineChart>
        </View>
      </LineChart.Provider>
    </GestureHandlerRootView>
  );
}
