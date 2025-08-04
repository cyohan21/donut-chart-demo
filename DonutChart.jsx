/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import {useFont} from '@shopify/react-native-skia';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Canvas, Path, Skia, Text as SkiaText} from '@shopify/react-native-skia';
import Svg, { Line, Circle, Text as SvgText, G } from 'react-native-svg';

// ===== DUMMY DATA =====
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const colors = ['#fe769c','#46a0f8','#c3f439','#88dabc','#9CA3AF','#ef4444'];

const DUMMY_DATA = {
  January: [
    { value: 3200, percentage: 16, color: colors[0], name: 'Food' },
    { value: 18000, percentage: 30, color: colors[1], name: 'Transport' },
    { value: 9000, percentage: 20, color: colors[2], name: 'Shopping' },
    { value: 15000, percentage: 25, color: colors[3], name: 'Bills' },
    { value: 4000, percentage: 9, color: colors[4], name: 'Other' },
  ],
  February: [
    { value: 12000, percentage: 24, color: '#fe769c', name: 'Food' },
    { value: 3000, percentage: 6, color: '#46a0f8', name: 'Transport' },
    { value: 20000, percentage: 40, color: '#c3f439', name: 'Shopping' },
    { value: 7000, percentage: 14, color: '#88dabc', name: 'Bills' },
    { value: 6000, percentage: 12, color: '#9CA3AF', name: 'Other' },
    { value: 1500, percentage: 7, color: '#ef4444', name: 'Insurance' },
  ],
  March: [
    { value: 5000, percentage: 10, color: '#fe769c', name: 'Food' },
    { value: 17000, percentage: 34, color: '#46a0f8', name: 'Transport' },
    { value: 4000, percentage: 8, color: '#c3f439', name: 'Shopping' },
    { value: 20000, percentage: 40, color: '#88dabc', name: 'Bills' },
    { value: 3000, percentage: 6, color: '#9CA3AF', name: 'Other' },
    { value: 1000, percentage: 5, color: '#ef4444', name: 'Insurance' },
  ],
  April: [
    { value: 8000, percentage: 16, color: '#fe769c', name: 'Food' },
    { value: 6000, percentage: 12, color: '#46a0f8', name: 'Transport' },
    { value: 15000, percentage: 30, color: '#c3f439', name: 'Shopping' },
    { value: 12000, percentage: 24, color: '#88dabc', name: 'Bills' },
    { value: 20000, percentage: 40, color: '#9CA3AF', name: 'Other' },
    { value: 1200, percentage: 6, color: '#ef4444', name: 'Insurance' },
  ],
  May: [
    { value: 20000, percentage: 40, color: '#fe769c', name: 'Food' },
    { value: 3000, percentage: 6, color: '#46a0f8', name: 'Transport' },
    { value: 18000, percentage: 36, color: '#c3f439', name: 'Shopping' },
    { value: 4000, percentage: 8, color: '#88dabc', name: 'Bills' },
    { value: 7000, percentage: 14, color: '#9CA3AF', name: 'Other' },
    { value: 1500, percentage: 7, color: '#ef4444', name: 'Insurance' },
  ],
  June: [
    { value: 15000, percentage: 30, color: '#fe769c', name: 'Food' },
    { value: 5000, percentage: 10, color: '#46a0f8', name: 'Transport' },
    { value: 12000, percentage: 24, color: '#c3f439', name: 'Shopping' },
    { value: 13000, percentage: 26, color: '#88dabc', name: 'Bills' },
    { value: 5000, percentage: 10, color: '#9CA3AF', name: 'Other' },
    { value: 1000, percentage: 5, color: '#ef4444', name: 'Insurance' },
  ],
  July: [
    { value: 18000, percentage: 36, color: '#fe769c', name: 'Food' },
    { value: 4000, percentage: 8, color: '#46a0f8', name: 'Transport' },
    { value: 15000, percentage: 30, color: '#c3f439', name: 'Shopping' },
    { value: 7000, percentage: 14, color: '#88dabc', name: 'Bills' },
    { value: 6000, percentage: 12, color: '#9CA3AF', name: 'Other' },
    { value: 1200, percentage: 6, color: '#ef4444', name: 'Insurance' },
  ],
  August: [
    { value: 14000, percentage: 28, color: '#fe769c', name: 'Food' },
    { value: 6000, percentage: 12, color: '#46a0f8', name: 'Transport' },
    { value: 16000, percentage: 32, color: '#c3f439', name: 'Shopping' },
    { value: 8000, percentage: 16, color: '#88dabc', name: 'Bills' },
    { value: 4000, percentage: 8, color: '#9CA3AF', name: 'Other' },
    { value: 1000, percentage: 5, color: '#ef4444', name: 'Insurance' },
  ],
  September: [
    { value: 17000, percentage: 34, color: '#fe769c', name: 'Food' },
    { value: 3000, percentage: 6,  color: '#46a0f8', name: 'Transport' },
    { value: 14000, percentage: 28, color: '#c3f439', name: 'Shopping' },
    { value: 9000, percentage: 18, color: '#88dabc', name: 'Bills' },
    { value: 7000, percentage: 14, color: '#9CA3AF', name: 'Other' },
    { value: 1000, percentage: 5, color: '#ef4444', name: 'Insurance' },
  ],
  October: [
    { value: 16000, percentage: 32, color: '#fe769c', name: 'Food' },
    { value: 4000, percentage: 8, color: '#46a0f8', name: 'Transport' },
    { value: 13000, percentage: 26, color: '#c3f439', name: 'Shopping' },
    { value: 8000, percentage: 16, color: '#88dabc', name: 'Bills' },
    { value: 6000, percentage: 12, color: '#9CA3AF', name: 'Other' },
    { value: 1000, percentage: 5, color: '#ef4444', name: 'Insurance' },
  ],
  November: [
    { value: 15000, percentage: 30, color: '#fe769c', name: 'Food' },
    { value: 3500, percentage: 7, color: '#46a0f8', name: 'Transport' },
    { value: 12000, percentage: 24, color: '#c3f439', name: 'Shopping' },
    { value: 10000, percentage: 20, color: '#88dabc', name: 'Bills' },
    { value: 9500, percentage: 19, color: '#9CA3AF', name: 'Other' },
    { value: 1000, percentage: 5, color: '#ef4444', name: 'Insurance' },
  ],
  December: [
    { value: 22000, percentage: 44, color: '#fe769c', name: 'Food' },
    { value: 4000, percentage: 8, color: '#46a0f8', name: 'Transport' },
    { value: 11000, percentage: 22, color: '#c3f439', name: 'Shopping' },
    { value: 7000, percentage: 14, color: '#88dabc', name: 'Bills' },
    { value: 4000, percentage: 8, color: '#9CA3AF', name: 'Other' },
    { value: 1000, percentage: 5, color: '#ef4444', name: 'Insurance' },
  ],
};

// ===== CHART CONSTANTS =====
const RADIUS = 140;
const STROKE_WIDTH = 38;
const OUTER_STROKE_WIDTH = 34;
const GAP = 0.053;
const FALLBACK_COLORS = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#ef4444', '#ff9800', '#8e24aa', '#00acc1'];

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ITEM_WIDTH = 130;
const SIDE_PAD = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

// ===== UTILITY FUNCTIONS =====
function formatAmount(amount) {
  if (amount < 1) return '<$1';
  if (amount < 1000) return `$${Math.floor(amount)}`;
  if (amount < 100000) {
    const k = amount / 1000;
    return Number.isInteger(k) ? `$${k.toFixed(0)}k` : `$${k.toFixed(1)}k`;
  }
  const rounded = Math.round(amount / 50_000) * 50_000;
  return `$${(rounded / 1000).toFixed(0)}k`;
}

// Generate weekly data for comparison chart
const generateWeeklyData = (currentMonthData, previousMonthData, monthName) => {
  const currentTotal = currentMonthData.reduce((acc, item) => acc + item.value, 0);
  const previousTotal = previousMonthData.reduce((acc, item) => acc + item.value, 0);
  
  const currentWeeklyPercentages = [0, 0.08, 0.35, 0.65, 1.0];
  const previousWeeklyPercentages = [0, 0.18, 0.25, 0.80, 1.0];
  
  const monthAbbr = monthName.slice(0, 3);
  const weekDates = [1, 8, 15, 22, 29];
  
  return currentWeeklyPercentages.map((percentage, index) => ({
    week: `${monthAbbr} ${weekDates[index]}`,
    previousMonth: Math.round(previousTotal * previousWeeklyPercentages[index]),
    currentMonth: Math.round(currentTotal * percentage),
  }));
};

// ===== DONUT PATH COMPONENT =====
const DonutPath = ({
  radius,
  gap,
  strokeWidth,
  outerStrokeWidth,
  color,
  decimals,
  index,
}) => {
  const innerRadius = radius - outerStrokeWidth / 2;
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);
  const halfGap = gap / 2;

  const start = decimals.value.slice(0, index).reduce((a, b) => a + b, 0) + halfGap;
  const end = decimals.value.slice(0, index + 1).reduce((a, b) => a + b, 0) - halfGap;

  return (
    <Path
      path={path}
      color={color}
      style="stroke"
      strokeJoin="round"
      strokeWidth={strokeWidth}
      strokeCap="round"
      start={start}
      end={end}
    />
  );
};

// ===== DONUT CHART COMPONENT =====
const DonutChart = ({
  n,
  gap,
  decimals,
  colors,
  totalValue,
  strokeWidth,
  outerStrokeWidth,
  radius,
  font,
  formattedTotal,
}) => {
  const array = Array.from({length: n});
  const innerRadius = radius - outerStrokeWidth / 2;
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const smallFont = useFont(require('./fonts/Roboto-Bold.ttf'), 40);
  const isNoData = formattedTotal === "No Data";
  const displayFont = isNoData && smallFont ? smallFont : font;
  
  const fontSize = displayFont.measureText(isNoData ? 'No Data' : '$00');
  const textX = radius - displayFont.measureText(formattedTotal).width / 2;

  return (
    <View style={{flex: 1}}>
      <Canvas style={{flex: 1}}>
        {array.map((_, index) => {
          return (
            <DonutPath
              key={index}
              radius={radius}
              strokeWidth={strokeWidth}
              outerStrokeWidth={outerStrokeWidth}
              color={colors[index]}
              decimals={decimals}
              index={index}
              gap={gap}
            />
          );
        })}
        <SkiaText
          x={textX}
          y={radius + fontSize.height / 2}
          text={formattedTotal}
          font={displayFont}
          color="black"
        />
      </Canvas>
    </View>
  );
};

// ===== RENDER ITEM COMPONENT =====
const RenderItem = ({item}) => {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, {backgroundColor: item.color}]} />
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
      <Text style={styles.amount}>{formatAmount(item.value)}</Text>
    </View>
  );
};

// ===== COMPARISON CHART COMPONENT =====
const ComparisonChart = ({ data, previousMonthName, currentMonthName }) => {
  const CHART_WIDTH = SCREEN_WIDTH - 40;
  const CHART_HEIGHT = 320;
  const PADDING = 50;
  
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.previousMonth, d.currentMonth)),
    100
  );
  
  const yAxisMax = Math.ceil(maxValue / 100) * 100;
  const chartInnerWidth = CHART_WIDTH - (PADDING * 2);
  const chartInnerHeight = CHART_HEIGHT - (PADDING * 2);
  const xStep = chartInnerWidth / (data.length - 1);
  
  const getYPosition = (value) => {
    return PADDING + chartInnerHeight - (value / yAxisMax) * chartInnerHeight;
  };
  
  const getXPosition = (index) => {
    return PADDING + index * xStep;
  };

  const yAxisSteps = 5;
  const yAxisLabels = Array.from({ length: yAxisSteps + 1 }, (_, i) => {
    return (yAxisMax / yAxisSteps) * i;
  });

  const formatAmount = (amount) => {
    if (amount < 1000) return `$${Math.floor(amount)}`;
    return `$${(amount / 1000).toFixed(0)}k`;
  };

  return (
    <View style={styles.comparisonContainer}>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#9CA3AF' }]} />
          <Text style={styles.legendText}>{previousMonthName}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#6a12e4' }]} />
          <Text style={styles.legendText}>{currentMonthName}</Text>
        </View>
      </View>
      
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT} style={styles.chart}>
        {yAxisLabels.map((value, index) => {
          const y = getYPosition(value);
          return (
            <G key={`y-axis-${index}`}>
              <Line
                x1={PADDING}
                y1={y}
                x2={CHART_WIDTH - PADDING}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth="1"
              />
              <SvgText
                x={PADDING - 10}
                y={y + 5}
                fontSize="12"
                fill="#666"
                textAnchor="end"
              >
                {formatAmount(value)}
              </SvgText>
            </G>
          );
        })}
        
        {data.map((item, index) => {
          const x = getXPosition(index);
          return (
            <SvgText
              key={`x-label-${index}`}
              x={x}
              y={CHART_HEIGHT - 10}
              fontSize="11"
              fill="#666"
              textAnchor="middle"
            >
              {item.week}
            </SvgText>
          );
        })}
        
        {data.map((item, index) => {
          if (index === 0) return null;
          const prevPoint = data[index - 1];
          const x1 = getXPosition(index - 1);
          const y1 = getYPosition(prevPoint.previousMonth);
          const x2 = getXPosition(index);
          const y2 = getYPosition(item.previousMonth);
          
          return (
            <Line
              key={`prev-line-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#9CA3AF"
              strokeWidth="3"
            />
          );
        })}
        
        {data.map((item, index) => {
          if (index === 0) return null;
          const prevPoint = data[index - 1];
          const x1 = getXPosition(index - 1);
          const y1 = getYPosition(prevPoint.currentMonth);
          const x2 = getXPosition(index);
          const y2 = getYPosition(item.currentMonth);
          
          return (
            <Line
              key={`curr-line-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#6a12e4"
              strokeWidth="3"
            />
          );
        })}
        
        {data.map((item, index) => {
          const x = getXPosition(index);
          const y = getYPosition(item.previousMonth);
          
          return (
            <Circle
              key={`prev-point-${index}`}
              cx={x}
              cy={y}
              r="5"
              fill="#9CA3AF"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        
        {data.map((item, index) => {
          const x = getXPosition(index);
          const y = getYPosition(item.currentMonth);
          
          return (
            <Circle
              key={`curr-point-${index}`}
              cx={x}
              cy={y}
              r="5"
              fill="#6a12e4"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </Svg>
    </View>
  );
};

// ===== MAIN DEMO COMPONENT =====
export const DonutChartDemo = () => {
  // All hooks must be called in the same order every time
  const flatRef = React.useRef(null);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('monthly');
  const totalValue = useSharedValue(0);
  const decimals = useSharedValue([]);
  const font = useFont(require('./fonts/Roboto-Bold.ttf'), 60);

  // Update chart when selected month changes
  useEffect(() => {
    const monthData = DUMMY_DATA[selectedMonth] || [];
    
    setData(monthData);
    const total = monthData.reduce((acc, item) => acc + item.value, 0);
    totalValue.value = withTiming(total, { duration: 400 });

    if (monthData.length === 0 || total === 0) {
      decimals.value = [];
    } else {
      const MIN_VISIBLE = 0.07;
      const decimalsRaw = monthData.map(item => item.percentage / 100);
      const boosted = decimalsRaw.map(d => Math.max(d, MIN_VISIBLE));
      const sumBoosted = boosted.reduce((a, b) => a + b, 0);
      decimals.value = boosted.map(d => d / sumBoosted);
    }
  }, [selectedMonth, totalValue, decimals]);

  // Early return after all hooks are called
  if (!font) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Loading...</Text>
    </View>;
  }

  const totalAmount = data.reduce((acc, item) => acc + item.value, 0);
  const formattedTotal = totalAmount > 0 ? formatAmount(totalAmount) : "No Data";
  
  const categoryColors = data.map(item => item.color || '#9CA3AF');
  const n = Math.max(data.length, 8);

  // Get previous month for comparison  
  const currentMonthIndex = MONTHS.indexOf(selectedMonth);
  const previousMonthIndex = currentMonthIndex > 0 ? currentMonthIndex - 1 : MONTHS.length - 1;
  const previousMonth = MONTHS[previousMonthIndex];
  
  const previousMonthData = DUMMY_DATA[previousMonth] || [];
  const weeklyData = generateWeeklyData(data, previousMonthData, selectedMonth);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Analytics Demo</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[
              styles.optionsButton,
              activeTab === 'monthly' && styles.activeTab,
              activeTab !== 'monthly' && styles.inactiveTab
            ]}
            onPress={() => setActiveTab('monthly')}
          >
            <Text style={[
              styles.year,
              activeTab !== 'monthly' && styles.inactiveTabText
            ]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.optionsButton, 
              { width: 180 },
              activeTab === 'comparison' && styles.activeTab,
              activeTab !== 'comparison' && styles.inactiveTab
            ]}
            onPress={() => setActiveTab('comparison')}
          >
            <Text style={[
              styles.year,
              activeTab !== 'comparison' && styles.inactiveTabText
            ]}>Comparison</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'monthly' ? (
          <>
            {/* Month Selector Row */}
            <FlatList
              ref={flatRef}
              data={MONTHS}
              horizontal
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              snapToAlignment="center"
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={e => {
                const rawIdx = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
                const idx = Math.max(0, Math.min(MONTHS.length - 1, rawIdx));
                const month = MONTHS[idx];
                if (month && month !== selectedMonth) {
                  setSelectedMonth(month);
                }
              }}
              onMomentumScrollEnd={e => {
                const offset = e.nativeEvent.contentOffset.x;
                const rawIdx = Math.round(offset / ITEM_WIDTH);
                const index = Math.max(0, Math.min(MONTHS.length - 1, rawIdx));
                setSelectedMonth(MONTHS[index]);
              }}
              contentContainerStyle={[
                styles.monthSelectorRow,
                {paddingHorizontal: 0},
              ]}
              ListHeaderComponent={<View style={{width: SIDE_PAD}} />}
              ListFooterComponent={<View style={{width: SIDE_PAD}} />}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={[
                    styles.monthButton,
                    {width: ITEM_WIDTH, alignItems: 'center'},
                    selectedMonth === item && styles.selectedMonthButton,
                  ]}
                  onPress={() => {
                    const idx = MONTHS.indexOf(item);
                    flatRef.current?.scrollToOffset({offset: idx * ITEM_WIDTH, animated: true});
                  }}
                >
                  <Text
                    style={[
                      styles.monthButtonText,
                      selectedMonth === item && styles.selectedMonthButtonText,
                      selectedMonth === item ? null : {opacity: 0.5},
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.chartContainer}>
              <DonutChart
                radius={RADIUS}
                gap={GAP}
                strokeWidth={STROKE_WIDTH}
                outerStrokeWidth={OUTER_STROKE_WIDTH}
                font={font}
                totalValue={totalValue}
                n={n}
                decimals={decimals}
                colors={categoryColors}
                formattedTotal={formattedTotal}
              />
            </View>
            <View style={styles.categoryContainer}>
              {Array.from({ length: Math.ceil(data.length / 2) }).map((_, rowIdx) => {
                const left = data[rowIdx * 2];
                const right = data[rowIdx * 2 + 1];
                return (
                  <View key={rowIdx} style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      {left && <RenderItem item={left} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      {right && <RenderItem item={right} />}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <>
            {/* Month Selector for Comparison */}
            <FlatList
              ref={flatRef}
              data={MONTHS}
              horizontal
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              snapToAlignment="center"
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={e => {
                const rawIdx = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
                const idx = Math.max(0, Math.min(MONTHS.length - 1, rawIdx));
                const month = MONTHS[idx];
                if (month && month !== selectedMonth) {
                  setSelectedMonth(month);
                }
              }}
              onMomentumScrollEnd={e => {
                const offset = e.nativeEvent.contentOffset.x;
                const rawIdx = Math.round(offset / ITEM_WIDTH);
                const index = Math.max(0, Math.min(MONTHS.length - 1, rawIdx));
                setSelectedMonth(MONTHS[index]);
              }}
              contentContainerStyle={[
                styles.monthSelectorRow,
                {paddingHorizontal: 0},
              ]}
              ListHeaderComponent={<View style={{width: SIDE_PAD}} />}
              ListFooterComponent={<View style={{width: SIDE_PAD}} />}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={[
                    styles.monthButton,
                    {width: ITEM_WIDTH, alignItems: 'center'},
                    selectedMonth === item && styles.selectedMonthButton,
                  ]}
                  onPress={() => {
                    const idx = MONTHS.indexOf(item);
                    flatRef.current?.scrollToOffset({offset: idx * ITEM_WIDTH, animated: true});
                  }}
                >
                  <Text
                    style={[
                      styles.monthButtonText,
                      selectedMonth === item && styles.selectedMonthButtonText,
                      selectedMonth === item ? null : {opacity: 0.5},
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <ComparisonChart
              data={weeklyData}
              previousMonthName={previousMonth}
              currentMonthName={selectedMonth}
            />
          </>
        )}

        <View style={styles.demoNote}>
          <Text style={styles.demoNoteText}>This is a demo with dummy data</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    marginTop: 15,
    paddingLeft: 20,
    fontSize: 40,
    fontWeight: '600',
    color: '#6a12e4ff'
  },
  optionsContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  optionsButton: {
    borderRadius: 100,
    backgroundColor: '#6a12e4ff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 40,
  },
  year: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white'
  },
  monthSelectorRow: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  monthButton: {
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMonthButton: {
    backgroundColor: 'transparent',
  },
  monthButtonText: {
    color: 'black',
    fontSize: 20,
  },
  selectedMonthButtonText: {
    color: '#6D28D9',
    fontWeight: 'bold',
    fontSize: 20,
  },
  chartContainer: {
    marginTop: 35,
    width: RADIUS * 2 + 10,
    height: RADIUS * 2 + 20,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  categoryContainer: {
    marginTop: 20,
    alignSelf: 'center', 
    minWidth: 220, 
    maxWidth: 380, 
    width: '100%',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    flex: 1,
    width: '90%'
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    marginLeft: 10,
  },
  name: {
    flex: 1,
    fontSize: 15,
    color: 'black',
    fontWeight: '400',
    marginRight: 8,
    minWidth: 0,
  },
  amount: {
    fontSize: 15,
    color: 'black',
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 50,
  },
  activeTab: {
    backgroundColor: '#6D28D9',
    borderRadius: 100,
  },
  inactiveTab: {
    backgroundColor: '#c9c9c9ff',
    borderRadius: 100,
  },
  inactiveTabText: {
    color: 'black',
  },
  comparisonContainer: {
    marginTop: 35,
    width: '100%',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  chart: {
    backgroundColor: 'white',
  },
  demoNote: {
    marginTop: 35,
    marginBottom: 20,
    alignItems: 'center',
  },
  demoNoteText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default DonutChartDemo; 