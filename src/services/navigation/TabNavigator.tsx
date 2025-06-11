import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardContainer from '../../containers/Dashboard/DashboardContainer.tsx';
import ReportContainer from '../../containers/Dashboard/ReportContainer.tsx';
import DrivingScreen from '../../screens/Driving/DrivingScreen.tsx';
import DrivingHistoryContainer from '../../containers/Driving/DrivingHistoryContainer';
import DrivingDetailContainer from '../../containers/Driving/DrivingDetailContainer';
import CarbonEmissionReportContainer from '../../containers/Driving/CarbonEmissionReportContainer';
import SafetyReportContainer from '../../containers/Driving/SafetyReportContainer';
import AccidentPreventionReportContainer from '../../containers/Driving/AccidentPreventionReportContainer';
import AttentionScoreReportContainer from '../../containers/Driving/AttentionScoreReportContainer';
import SeedsContainer from '../../containers/Seeds/SeedsContainer.tsx';
import ScreenLayout from '../../components/common/CommonLayout.tsx';
import CustomHeader from '../../components/common/CustomHeader.tsx';
import {MypageContainer} from '../../containers/Mypage/MypageContainer.tsx';
import {MypageCarContainer} from '../../containers/Mypage/MypageCarContainer.tsx';
import {MypageInfoContainer} from '../../containers/Mypage/MypageInfoContainer.tsx';
import {MypageInterestContainer} from '../../containers/Mypage/MypageInterestContainer.tsx';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardContainer}
        options={{
          header: () => <CustomHeader leftType="logo" rightType="none" />,
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={ReportContainer}
        options={{
          header: () => (
            <CustomHeader
              leftType="back"
              title="주간 주행 리포트"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function DrivingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrivingHistory"
        component={DrivingHistoryContainer} // DrivingHistoryScreen에서 Container로 변경
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Driving"
        component={DrivingScreen}
        options={{
          header: () => (
            <CustomHeader leftType="back" rightType="none" title="주행 상세" />
          ),
        }}
      />
      <Stack.Screen
        name="DrivingDetail"
        component={DrivingDetailContainer} // DrivingDetailScreen에서 Container로 변경
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="SafetyReport"
        component={SafetyReportContainer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CarbonEmissionReport"
        component={CarbonEmissionReportContainer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AccidentPreventionReport"
        component={AccidentPreventionReportContainer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AttentionScoreReport"
        component={AttentionScoreReportContainer}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function SeedsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Seeds"
        component={SeedsContainer}
        options={{
          header: () => <CustomHeader leftType="logo" rightType="none" />,
        }}
      />
    </Stack.Navigator>
  );
}

function MypageStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Mypage"
        component={MypageContainer}
        options={{
          header: () => <CustomHeader leftType="logo" rightType="none" />,
        }}
      />
      <Stack.Screen
        name="MypageCar"
        component={MypageCarContainer}
        options={{
          header: () => (
            <CustomHeader leftType="back" title="내 차 정보" />
          ),
        }}
      />
      <Stack.Screen
        name="MypageInfo"
        component={MypageInfoContainer}
        options={{
          header: () => <CustomHeader leftType="back" title="내 정보" />,
        }}
      />
      <Stack.Screen
        name="MypageInterest"
        component={MypageInterestContainer}
        options={{
          header: () => <CustomHeader leftType="back" title="내 관심사" />,
        }}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          if (route.name === 'Home')
            return <AntDesign name="home" size={size} color={color} />;
          if (route.name === 'Drive')
            return <Feather name="pie-chart" size={size} color={color} />;
          if (route.name === 'Seed')
            return (
              <MaterialCommunity
                name="seed-outline"
                size={size}
                color={color}
              />
            );
          if (route.name === 'User')
            return <Feather name="user" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4945FF',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home">
        {() => (
          <ScreenLayout>
            <DashboardStack />
          </ScreenLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Drive">
        {() => (
          <ScreenLayout>
            <DrivingStack />
          </ScreenLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Seed">
        {() => (
          <ScreenLayout>
            <SeedsStack />
          </ScreenLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="User">
        {() => (
          <ScreenLayout>
            <MypageStack />
          </ScreenLayout>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
