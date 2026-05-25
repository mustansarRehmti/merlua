// import React from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// import { AppNavigator } from './src/navigation/app-navigator';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { TenantProvider } from './src/context/tenant-context';
// import { NavigationContainer } from '@react-navigation/native';

// export default function App() {
//   return (
//     <NavigationContainer>
//     <TenantProvider>
//       <SafeAreaProvider>
//       <AppNavigator />
//      </SafeAreaProvider>
//     </TenantProvider>
//     </NavigationContainer>
//   );
// }

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Camera, useCameraPermission, useCameraDevice } from 'react-native-vision-camera';
import { useBarcodeScannerOutput, type Barcode } from 'react-native-vision-camera-barcode-scanner';

export default function TestCameraApp(): React.JSX.Element {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Get your back camera device reference
  const device = useCameraDevice('back');

  // V5 Modular Architecture: Setup the output pipeline from the barcode-scanner plugin
  const barcodeOutput = useBarcodeScannerOutput({
    barcodeFormats: ['qr-code'], // limits tracking strictly to QR codes for maximum speed
    onBarcodeScanned: (barcodes: Barcode[]): void => {
      if (barcodes && barcodes.length > 0) {
        const val = barcodes[0].value;
        console.log("🚀 SUCCESS! Scanned Code Payload Data:", val);
        setScanResult(val ?? "Empty Code");
      }
    },
    onError: (error) => {
      console.error("Scanner Pipeline Error:", error);
    }
  });

  // Request system permissions on launch
  useEffect(() => {
    async function verifyAccess() {
      if (!hasPermission) {
        await requestPermission();
      }
    }
    verifyAccess();
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.text}>Requesting System Camera Permissions...</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Error: Back camera hardware device not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* V5 Architecture: Pass your configured plugins inside the outputs array array hook */}
      <Camera
        style={StyleSheet.absoluteFill}
        isActive={true}
        device={device}
        outputs={[barcodeOutput]}
      />

      {/* Overlay Heads-Up Display HUD */}
      <View style={styles.overlayHUD}>
        <Text style={styles.hudTitle}>FLEXCHANCE SCANNER TEST</Text>
        <Text style={styles.hudSubtitle}>
          {scanResult ? `🎯 Last Captured Slug: ${scanResult}` : "📷 Point camera at any QR code..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  text: { marginTop: 10, fontSize: 14, color: '#666', textAlign: 'center' },
  overlayHUD: { position: 'absolute', bottom: 50, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.85)', padding: 16, alignItems: 'center', borderRadius: 8 },
  hudTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginBottom: 4 },
  hudSubtitle: { color: '#A3A3A3', fontSize: 14, textAlign: 'center' }
});
