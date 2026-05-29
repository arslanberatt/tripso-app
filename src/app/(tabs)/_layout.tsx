import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/theme';
import { useGlassCapability } from '@/hooks/use-glass-capability';
import { usePreferences } from '@/hooks/use-preferences';

/**
 * Tab navigator — Home / Explore / Trips / Profile.
 *
 * `NativeTabs` (SDK 56) gerçek native tab bar verir (iOS UITabBar / Android
 * BottomNavigation), iOS 26'da Liquid Glass tab bar'ı otomatik kullanır.
 *
 * İkonlar: Home/Explore PNG asset (template, cross-platform). Trips/Profile
 * iOS'ta SF Symbol, Android'de drawable.
 * TODO(icons): Trips/Profile için Android drawable kaynakları eklenmeli
 * (şu an iOS'ta SF Symbol; Android'de eksikse label-only görünür).
 */
export default function TabsLayout() {
  const { colorScheme } = usePreferences();
  const colors = Colors[colorScheme];
  const { isLiquidGlass } = useGlassCapability();
  const { t } = useTranslation();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.primary } }}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>{t('common:tabs.home')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>{t('common:tabs.explore')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      {/*
       * Arama sekmesi — iOS 26'da `role="search"` ile native arama rolünü kullanır
       * (Liquid Glass tab bar'da özel arama görünümü). iOS 18 ve Android'de sekme
       * GİZLİ (`hidden`); o platformlarda arama, Home'daki arama çubuğuna dokununca
       * `/search`'e push ile açılır. Her iki yol da aynı `/search` ekranına gider.
       */}
      <NativeTabs.Trigger name="search" role="search" hidden={!isLiquidGlass}>
        <NativeTabs.Trigger.Label>{t('common:tabs.search')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" drawable="ic_menu_search" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="trips">
        <NativeTabs.Trigger.Label>{t('common:tabs.trips')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="airplane" drawable="ic_menu_send" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>{t('common:tabs.profile')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle" drawable="ic_menu_myplaces" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
