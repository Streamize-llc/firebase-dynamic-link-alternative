"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CodeBlock from "@/components/codeblock"

export default function DocsClientPage() {
  const params = useParams()
  const projectId = params.id as string
  const [activeTab, setActiveTab] = useState("common")

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-sm">Client Docs</h1>
        <div className="flex items-center mt-3">
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <p className="text-sm text-blue-400 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 13.197l-4.419 2.617A1 1 0 014 15V4z" clipRule="evenodd" />
              </svg>
              Project ID: {projectId}
            </p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="common" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-8">
          <TabsList className="bg-transparent h-auto p-0 mb-0">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <TabsTrigger 
                value="common" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                Common Settings
              </TabsTrigger>
              <TabsTrigger 
                value="react-native" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                React Native
              </TabsTrigger>
              <TabsTrigger 
                value="flutter" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                Flutter
              </TabsTrigger>
              <TabsTrigger 
                value="android" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                Native Android
              </TabsTrigger>
              <TabsTrigger 
                value="ios" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                Native iOS
              </TabsTrigger>

              {/* <TabsTrigger 
                value="ios" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                Q&A
              </TabsTrigger> */}
            </div>
          </TabsList>
        </div>
        
        <TabsContent value="common" className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Common Configuration Guide</h2>
          </div>
          <div className="space-y-6 text-gray-300">
            <p>Documentation for common project configuration. Check the basic settings that apply to all platforms.</p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 font-medium">Before you begin, make sure your project setup is complete.</p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4 flex items-center bg-gradient-to-r from-green-900/30 to-transparent px-4 py-2 rounded-lg border-l-4 border-green-500 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-3 text-green-400" fill="currentColor">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
              </svg>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500 font-bold">Android Configuration Guide</span>
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                To implement deep links in Android apps, you need to add appropriate intent filters to the AndroidManifest.xml file.
                Refer to the example code below for configuration.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 font-medium">
                  The package name and SHA-256 certificate fingerprint must exactly match what you entered during Android app registration.
                </p>
              </div>
            </div>
            <CodeBlock language="xml" filename="AndroidManifest.xml">
              {`
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.dateapp">
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- INSERT THIS CODE -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="dateapp.depl.link" />
                <data android:scheme="http" android:host="dateapp.depl.link" />
            </intent-filter>
            <!-- ---------------- -->
        </activity>
    </application>
</manifest>
              `}
            </CodeBlock>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4 flex items-center bg-gradient-to-r from-blue-900/30 to-transparent px-4 py-2 rounded-lg border-l-4 border-blue-500 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-3 text-blue-400" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500 font-bold">iOS Configuration Guide</span>
            </h3>

            <div className="space-y-4">
              <p className="text-gray-300">
                To implement deep links in iOS apps, you need to add URL schemes and Universal Link settings to the Info.plist file.
                Refer to the example code below for configuration.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 font-medium">
                  The bundle ID and team ID must exactly match what you entered during iOS app registration.
                </p>
              </div>
            </div>
            <CodeBlock language="xml" filename="Info.plist">
              {`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Existing settings -->
    
    <!-- URL Scheme settings -->
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>CFBundleURLName</key>
            <string>com.example.dateapp</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>dateapp</string>
            </array>
        </dict>
    </array>
    
    <!-- Universal Links settings -->
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:dateapp.depl.link</string>
    </array>
</dict>
</plist>
              `}
            </CodeBlock>

            <div className="mt-6 space-y-4">
              <p className="text-gray-300">
                Additionally, you need to enable Associated Domains in your app's Capabilities settings,
                and add the domain to the entitlements file.
              </p>
            </div>
            <CodeBlock language="xml" filename="[AppName].entitlements">
              {`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:dateapp.depl.link</string>
    </array>
</dict>
</plist>
              `}
            </CodeBlock>

          </div>
        </TabsContent>
        
        <TabsContent value="react-native" className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 0 0-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 0 0-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 0 1 3.233-.501 24.847 24.847 0 0 1 2.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zM16.795 22.677c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 0 0 2.421-2.968l.135-.193.234-.02a23.63 23.63 0 0 0 3.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 0 1-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 0 1-3.234.501 24.674 24.674 0 0 1-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 0 0-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 0 0-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0 1 14.75 7.24zM7.206 22.677A2.38 2.38 0 0 1 6 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 0 0 2.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 0 1-2.052-2.545 24.976 24.976 0 0 1-3.233-.501zM12 16.878c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 0 1-1.35-2.122 30.354 30.354 0 0 1-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 0 1 1.166-2.228c.414-.716.869-1.43 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 0 1 5.033 0l.234.02.134.193a30.006 30.006 0 0 1 2.517 4.35l.101.213-.101.213a29.6 29.6 0 0 1-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 0 0 2.196-3.798 28.585 28.585 0 0 0-2.197-3.798 29.031 29.031 0 0 0-4.394 0 28.477 28.477 0 0 0-2.197 3.798 29.114 29.114 0 0 0 2.197 3.798z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">React Native Guide</h2>
          </div>
          
          <div className="space-y-6 text-gray-300">
            <p className="leading-relaxed">Learn how to implement deep links in your React Native app. Follow these steps for easy setup.</p>
            
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-5 my-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Before You Begin</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>You should have a React Native project set up</li>
                <li>Android and iOS platform configurations should be complete</li>
                <li>Your app should be registered in the project</li>
              </ul>
            </div>

            <div className="mt-6 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-amber-300 mb-3">Why We Don't Provide a DELP SDK</h3>
              <div className="space-y-3 text-gray-300">
                <p className="leading-relaxed">
                  Deep linking is already natively supported in all cross-platform environments. It can be easily implemented through native APIs without additional SDKs.
                </p>
                <p className="leading-relaxed">
                  Adding an SDK has several disadvantages:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Adds unnecessary dependencies to your project</li>
                  <li>Increases app size</li>
                  <li>Creates version management and maintenance costs</li>
                  <li>Potential compatibility issues</li>
                </ul>
                <p className="leading-relaxed">
                  The essence of deep linking is simple. Using native APIs directly enables more efficient and flexible implementation.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Installation</h3>
              <div className="bg-gradient-to-r from-green-900/20 to-teal-900/20 border border-green-500/30 rounded-lg p-5 mb-4">
                <p className="text-gray-300">
                  React Native already has the Linking API built in. If you can use React Native's Linking, you can skip this step as implementation is possible without additional installation.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm text-blue-300 overflow-x-auto mb-4">
                <pre>npm install @react-native-community/cli-platform-android</pre>
              </div>
              <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-lg p-5">
                <p className="text-gray-300 mb-3">
                  Installation methods may vary depending on your project type (Expo or Bare React Native):
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><span className="text-purple-300 font-semibold">Expo projects</span>: Expo provides built-in functionality for deep linking. Use the expo-linking package.</li>
                  <li><span className="text-purple-300 font-semibold">Bare React Native</span>: Native module configuration may be required. Use the package above or React Native's default Linking API.</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Implementation Example</h3>
            <CodeBlock language="javascript" filename="App.js">
              {`
import React, { useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  // Function to handle deep links
  const handleDeepLink = (url) => {
    if (url) {
      console.log('Received URL via deep link:', url);
      // Parse the URL here and route to appropriate screen
      // Example: If URL is /user/123, navigate to user profile screen
    }
  };

  useEffect(() => {
    // Handle case when app is opened from deep link while not running
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Event listener for when app is already running and receives deep link
    const linkingListener = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Clean up listener when component unmounts
    return () => {
      linkingListener.remove();
    };
  }, []);

  // React Navigation configuration
  const linking = {
    prefixes: ['dateapp://app', 'https://dateapp.depl.link'],
    config: {
      screens: {
        Home: 'home',
        Profile: 'user/:id',
        Settings: 'settings',
        // Add more screens as needed
      }
    }
  };

  return (
    <NavigationContainer linking={linking}>
      {/* Configure your navigation stack here */}
    </NavigationContainer>
  );
};

export default App;
              `}
            </CodeBlock>
            </div>
            
            <div className="flex items-center justify-center mt-10">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Example Code
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="flutter" className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Flutter Guide</h2>
          </div>
          
          <div className="space-y-6 text-gray-300">
            <p className="leading-relaxed">Learn how to implement deep links in Flutter apps. Follow the steps below for easy setup.</p>
            
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-5 my-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Before You Start</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>You should have a Flutter project set up</li>
                <li>Android and iOS platform configurations should be completed</li>
                <li>Your app should be registered in the project</li>
              </ul>
            </div>

            <div className="mt-6 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-amber-300 mb-3">Why Don't We Provide a DELP SDK?</h3>
              <div className="space-y-3 text-gray-300">
                <p className="leading-relaxed">
                  Deep linking is already natively supported in all cross-platform environments. It can be easily implemented through native APIs without additional SDKs.
                </p>
                <p className="leading-relaxed">
                  Adding an SDK has the following disadvantages:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Adds unnecessary dependencies to your project</li>
                  <li>Increases app size</li>
                  <li>Creates version management and maintenance costs</li>
                  <li>Potential compatibility issues</li>
                </ul>
                <p className="leading-relaxed">
                  The essence of deep linking is simple. Using native APIs directly enables more efficient and flexible implementation.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Implementation Example</h3>
            <CodeBlock language="dart" filename="main.dart">
              {`
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  // Variable to store the latest received deep link
  String _latestLink = 'No deep link received';
  
  // Deep link listener subscription
  StreamSubscription _linkSubscription;

  @override
  void initState() {
    super.initState();
    // Initialize deep links when app starts
    initDeepLinks();
  }

  // Initialize deep link handling
  Future<void> initDeepLinks() async {
    // Handle deep link if app was opened from terminated state
    try {
      final initialLink = await getInitialLink();
      if (initialLink != null) {
        setState(() {
          _latestLink = initialLink;
        });
        handleDeepLink(initialLink);
      }
    } on PlatformException {
      // Handle exceptions
      setState(() {
        _latestLink = 'Failed to get initial link';
      });
    }

    // Listen for deep links while app is running
    _linkSubscription = getLinksStream().listen((String link) {
      setState(() {
        _latestLink = link;
      });
      handleDeepLink(link);
    }, onError: (err) {
      setState(() {
        _latestLink = 'Failed to get link: $err';
      });
    });
  }

  // Process the deep link
  void handleDeepLink(String link) {
    // Parse the URL and navigate accordingly
    print('Handling deep link: $link');
    
    // Example: handle dateapp://app/user/123 format
    if (link.contains('/user/')) {
      final userId = link.split('/user/')[1];
      navigateToUserProfile(userId);
    }
  }

  // Navigate to user profile page
  void navigateToUserProfile(String userId) {
    // Navigation logic
    print('Navigating to user profile: $userId');
  }

  // Get initial deep link (mock implementation)
  Future<String> getInitialLink() async {
    // In real implementation, use platform channel to communicate with native code
    return Future.delayed(Duration(milliseconds: 500), () => null);
  }

  // Get stream of deep links (mock implementation)
  Stream<String> getLinksStream() {
    // In real implementation, use platform channel to communicate with native code
    return Stream.periodic(Duration(seconds: 1), (i) => null).take(0);
  }

  @override
  void dispose() {
    _linkSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Deep Link Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        appBar: AppBar(
          title: Text('Deep Link Demo'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text('Latest received deep link:'),
              SizedBox(height: 8),
              Text(
                _latestLink,
                style: Theme.of(context).textTheme.headline6,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
              `}
            </CodeBlock>
            </div>
            
            <div className="flex items-center justify-center mt-10">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Example Code
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="android" className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.34l.5-1.2-2.2-1.7-2.5 1.7.6 1.2 1.7-1.2 1.9 1.2zM6.823 15.34l.5-1.2-2.2-1.7-2.5 1.7.6 1.2 1.7-1.2 1.9 1.2z"/>
                <path d="M12.723 2.44l-1.4.9-8.5 5.6-.5 1.2 8.5 5.5.5.1.5-.1 8.5-5.5-.5-1.2-8.5-5.6-1.4-.9h1.4zm-1.4 1.9l9.4 6-9.4 6-9.4-6 9.4-6z"/>
                <path d="M12.723 22.76l.5-.1 8.5-5.5-.5-1.2-8.5 5.6-8.5-5.6-.5 1.2 8.5 5.5.5.1z"/>
                <path d="M12.723 19.46l.5-.1 8.5-5.5-.5-1.2-8.5 5.6-8.5-5.6-.5 1.2 8.5 5.5.5.1z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Native Android Guide</h2>
          </div>
          
          <div className="space-y-6 text-gray-300">
            <p className="leading-relaxed">Learn how to implement deep linking in your Native Android app. Follow these steps for easy setup.</p>
            
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-5 my-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Before You Start</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>You should have Android Studio installed</li>
                <li>Your app's package name must be registered</li>
              </ul>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Implementing Deep Link Handling Code</h3>
              <p className="mb-4">Add code to handle deep links in your MainActivity.java or MainActivity.kt file:</p>
              
              <div className="flex space-x-4 mb-4">
                <button className="px-4 py-2 bg-green-800/30 border border-green-600/30 rounded-md text-green-300 hover:bg-green-800/50 transition-colors">Java</button>
                <button className="px-4 py-2 bg-purple-800/30 border border-purple-600/30 rounded-md text-purple-300 hover:bg-purple-800/50 transition-colors">Kotlin</button>
              </div>
              
              <CodeBlock language="java" filename="MainActivity.java">
                {`public class MainActivity extends AppCompatActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Handle the intent that started this activity
        handleIntent(getIntent());
    }
    
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // Handle the intent when app is already running
        handleIntent(intent);
    }
    
    // Process the incoming deep link
    private void handleIntent(Intent intent) {
        String action = intent.getAction();
        Uri data = intent.getData();
        
        // Check if this is a deep link
        if (Intent.ACTION_VIEW.equals(action) && data != null) {
            String scheme = data.getScheme();
            String host = data.getHost();
            List<String> pathSegments = data.getPathSegments();
            
            // Log the deep link information
            Log.d("DeepLink", "Scheme: " + scheme);
            Log.d("DeepLink", "Host: " + host);
            
            // Example: handle different paths
            if (pathSegments.size() > 0) {
                String firstPathSegment = pathSegments.get(0);
                
                // Handle user profile path
                if ("user".equals(firstPathSegment) && pathSegments.size() > 1) {
                    String userId = pathSegments.get(1);
                    navigateToUserProfile(userId);
                }
                // Handle product path
                else if ("product".equals(firstPathSegment) && pathSegments.size() > 1) {
                    String productId = pathSegments.get(1);
                    navigateToProductDetail(productId);
                }
                // Handle other paths as needed
            }
        }
    }
    
    // Navigate to user profile screen
    private void navigateToUserProfile(String userId) {
        // Implementation to navigate to user profile
        Toast.makeText(this, "Navigate to user: " + userId, Toast.LENGTH_SHORT).show();
    }
    
    // Navigate to product detail screen
    private void navigateToProductDetail(String productId) {
        // Implementation to navigate to product detail
        Toast.makeText(this, "Navigate to product: " + productId, Toast.LENGTH_SHORT).show();
    }
}`}
              </CodeBlock>
              
              <div className="mt-6">
                <CodeBlock language="kotlin" filename="MainActivity.kt">
                  {`class MainActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Handle the intent that started this activity
        handleIntent(intent)
    }
    
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        // Handle the intent when app is already running
        handleIntent(intent)
    }
    
    // Process the incoming deep link
    private fun handleIntent(intent: Intent) {
        val action = intent.action
        val data = intent.data
        
        // Check if this is a deep link
        if (Intent.ACTION_VIEW == action && data != null) {
            val scheme = data.scheme
            val host = data.host
            val pathSegments = data.pathSegments
            
            // Log the deep link information
            Log.d("DeepLink", "Scheme: $scheme")
            Log.d("DeepLink", "Host: $host")
            
            // Example: handle different paths
            if (pathSegments.isNotEmpty()) {
                val firstPathSegment = pathSegments[0]
                
                // Handle user profile path
                if ("user" == firstPathSegment && pathSegments.size > 1) {
                    val userId = pathSegments[1]
                    navigateToUserProfile(userId)
                }
                // Handle product path
                else if ("product" == firstPathSegment && pathSegments.size > 1) {
                    val productId = pathSegments[1]
                    navigateToProductDetail(productId)
                }
                // Handle other paths as needed
            }
        }
    }
    
    // Navigate to user profile screen
    private fun navigateToUserProfile(userId: String) {
        // Implementation to navigate to user profile
        Toast.makeText(this, "Navigate to user: $userId", Toast.LENGTH_SHORT).show()
    }
    
    // Navigate to product detail screen
    private fun navigateToProductDetail(productId: String) {
        // Implementation to navigate to product detail
        Toast.makeText(this, "Navigate to product: $productId", Toast.LENGTH_SHORT).show()
    }
}`}
                </CodeBlock>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-10">
              <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-lg shadow-green-500/20 transition-all duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Example Code
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ios" className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.498 14.815s-.589 1.312-1.958 2.622c-1.34 1.284-2.794 1.125-2.794 1.125s-.478-1.28.811-2.743c1.346-1.525 3.052-1.663 3.941-1.004zm-3.423-10.497c.151-1.883-1.341-2.894-1.341-2.894s-1.593.726-2.329 2.038c-.815 1.448-.538 3.047-.538 3.047s1.634.139 2.663-1.225c.876-1.16 1.483-2.079 1.545-.966zm3.423 2.349c-3.296 0-3.986 3.135-3.986 3.135s2.186-.43 3.986 1.111c-1.092.732-1.898 1.637-2.511 2.532-1.341-.925-3.296-1.458-3.296-1.458s-2.186 3.076-5.482 3.076c-.03-1.331.37-3.424 2.186-5.444 1.957-2.175 4.421-2.952 4.421-2.952s-1.341-1.225-3.296-1.225c.03-1.019.37-2.039.925-2.952-1.957 0-3.666 1.019-4.792 2.532-1.341 1.77-2.037 4.076-2.037 6.463 0 5.444 4.273 9.52 9.606 9.52 5.333 0 9.606-4.076 9.606-9.52 0-5.444-4.273-9.52-9.606-9.52 1.341 0 2.511.293 3.666.925.185-.925.555-1.85 1.11-2.743-1.495 0-2.88.43-4.051 1.111.185-.732.555-1.458 1.11-2.039-1.11.293-2.096.732-2.88 1.364.03-.43.185-.732.37-1.019-2.037 1.019-3.666 2.743-4.421 4.782 0-.732.185-1.458.555-2.175-1.11 1.019-1.957 2.532-2.511 4.27 0-.732.185-1.458.555-2.175-.925 1.364-1.495 3.135-1.495 5.137 0 .732.03 1.364.185 2.039-.185-.732-.37-1.458-.37-2.175v-.293c-.185 1.77 0 3.541.555 5.137-.185-.732-.37-1.458-.37-2.175-1.11 5.137 1.495 10.274 6.272 12.449-4.792-1.225-8.458-5.444-8.458-10.581 0-.732.03-1.364.185-2.039-.185.732-.37 1.458-.37 2.175 0-5.137 3.296-9.52 7.903-11.042-.74.293-1.48.732-2.096 1.225.185-.293.555-.43.925-.732-.925.43-1.851 1.019-2.511 1.77.185-.293.555-.43.925-.732-1.11.732-2.037 1.77-2.682 2.952.185-.293.37-.732.74-1.019-.74.732-1.341 1.77-1.726 2.743.185-.43.37-.732.555-1.019-.555.925-.925 1.883-1.11 2.952.185-.43.185-.925.37-1.364-.37 1.364-.555 2.743-.555 4.27 0 .732.03 1.364.185 2.039-.185-.732-.185-1.458-.185-2.175 0 1.225.185 2.349.555 3.424-.185-.732-.37-1.458-.37-2.175.37 2.349 1.495 4.27 2.881 5.751-.74-.925-1.341-2.039-1.726-3.135.185.732.555 1.364.925 2.039-.555-.925-.925-1.883-1.11-2.952.185.732.555 1.364.925 2.039-.37-.925-.555-1.883-.74-2.952.185.732.37 1.364.74 2.039-.185-1.225-.185-2.349-.185-3.541 0-1.019.03-1.883.185-2.743-.185.732-.185 1.458-.185 2.175v.293c.185-2.743.925-5.137 2.037-7.176-.37.732-.555 1.458-.74 2.175.37-.925.74-1.77 1.11-2.532-.185.43-.37.732-.37 1.019.555-1.225 1.341-2.349 2.186-3.424-.37.43-.555.925-.74 1.364.555-.925 1.341-1.77 2.186-2.532-.37.293-.555.732-.74 1.019.925-1.019 2.037-1.883 3.296-2.532-.555.293-.925.732-1.341 1.019 1.11-.732 2.511-1.225 3.941-1.458-.555.293-1.11.732-1.495 1.019 1.495-.732 3.296-1.019 5.038-1.019z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Native iOS Guide</h2>
          </div>
          
          <div className="space-y-6 text-gray-300">
            <p className="leading-relaxed">Learn how to implement deep links in native iOS apps.</p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Implementation in Swift</h3>
              
              <CodeBlock language="swift" filename="AppDelegate.swift">
                {`import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    // URL scheme handling (iOS 9+)
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        return handleDeepLink(url: url)
    }
    
    // URL scheme handling (before iOS 9)
    func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
        return handleDeepLink(url: url)
    }
    
    // Universal Links handling
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb, let url = userActivity.webpageURL {
            return handleDeepLink(url: url)
        }
        return false
    }
    
    // Deep link handling logic
    private func handleDeepLink(url: URL) -> Bool {
        // Parse URL components
        let scheme = url.scheme
        let host = url.host
        let path = url.path
        let pathComponents = path.components(separatedBy: "/").filter { !$0.isEmpty }
        
        // Log deep link information
        print("Deep link received: \(url.absoluteString)")
        print("Scheme: \(scheme ?? "none")")
        print("Host: \(host ?? "none")")
        print("Path: \(path)")
        
        // Handle different paths
        if pathComponents.count > 0 {
            let firstPathComponent = pathComponents[0]
            
            // Handle user profile path
            if firstPathComponent == "user" && pathComponents.count > 1 {
                let userId = pathComponents[1]
                // Navigate to user profile
                return true
            }
            // Handle product path
            else if firstPathComponent == "product" && pathComponents.count > 1 {
                let productId = pathComponents[1]
                // Navigate to product detail
                return true
            }
        }
        
        return false
    }
}`}
              </CodeBlock>
              
              <h3 className="text-xl font-semibold text-white mt-10 mb-4">Implementation in Objective-C</h3>
              
              <CodeBlock language="objectivec" filename="AppDelegate.m">
                {`#import "AppDelegate.h"

@implementation AppDelegate

// URL scheme handling (iOS 9+)
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    return [self handleDeepLinkURL:url];
}

// URL scheme handling (before iOS 9)
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    return [self handleDeepLinkURL:url];
}

// Universal Links handling
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
    if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb] && userActivity.webpageURL) {
        return [self handleDeepLinkURL:userActivity.webpageURL];
    }
    return NO;
}

// Deep link handling logic
- (BOOL)handleDeepLinkURL:(NSURL *)url {
    // Parse URL components
    NSString *scheme = url.scheme;
    NSString *host = url.host;
    NSString *path = url.path;
    
    // Log deep link information
    NSLog(@"Deep link received: %@", url.absoluteString);
    NSLog(@"Scheme: %@", scheme ?: @"none");
    NSLog(@"Host: %@", host ?: @"none");
    NSLog(@"Path: %@", path);
    
    // Parse path components
    NSArray<NSString *> *pathComponents = [path componentsSeparatedByString:@"/"];
    NSMutableArray<NSString *> *filteredComponents = [NSMutableArray array];
    
    for (NSString *component in pathComponents) {
        if (component.length > 0) {
            [filteredComponents addObject:component];
        }
    }
    
    // Handle different paths
    if (filteredComponents.count > 0) {
        NSString *firstPathComponent = filteredComponents[0];
        
        // Handle user profile path
        if ([firstPathComponent isEqualToString:@"user"] && filteredComponents.count > 1) {
            NSString *userId = filteredComponents[1];
            // Navigate to user profile
            return YES;
        }
        // Handle product path
        else if ([firstPathComponent isEqualToString:@"product"] && filteredComponents.count > 1) {
            NSString *productId = filteredComponents[1];
            // Navigate to product detail
            return YES;
        }
    }
    
    return NO;
}

@end`}
              </CodeBlock>
            </div>
            
            <div className="flex items-center justify-center mt-10">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Example Code
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
