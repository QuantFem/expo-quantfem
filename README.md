# QuantFem - Women's Health Tracking App

QuantFem is an open-source mobile application designed to help women track and understand their health patterns. Built with React Native and Expo, it provides a comprehensive suite of health tracking features with a focus on privacy and data ownership.

## Features

### Core Features
- **Health Tracking**: Track various health metrics including periods, symptoms, sleep, nutrition, mood, medications, and activities
- **Calendar View**: Visual representation of tracked data with customizable views
- **Insights & Analytics**: Generate detailed insights and correlations between different health metrics
- **Doctor Reports**: Export comprehensive health reports for medical consultations
- **Data Export**: Export your health data in various formats for personal use or sharing with healthcare providers
- **Privacy First**: All data is stored locally on your device with optional encryption

### Trackers
1. **Period Tracker**
   - Track cycle start and end dates
   - Monitor flow intensity
   - Record associated symptoms
   - Predict future cycles

2. **Symptom Tracker**
   - Log various symptoms with severity levels
   - Track symptom duration
   - Add notes and triggers
   - View symptom patterns over time

3. **Sleep Tracker**
   - Record sleep duration
   - Track sleep quality
   - Monitor bedtime and wake time
   - Analyze sleep patterns

4. **Nutrition Tracker**
   - Log meals and snacks
   - Track food categories
   - Monitor water intake
   - Record food-related symptoms

5. **Mood Tracker**
   - Track daily mood
   - Record mood intensity
   - Add mood triggers
   - View mood patterns

6. **Medication Tracker**
   - Log medications taken
   - Track medication schedule
   - Monitor side effects
   - Set medication reminders

7. **Activity Tracker**
   - Log physical activities
   - Track activity duration
   - Monitor activity intensity
   - View activity patterns

8. **General Health Tracker**
   - Track weight changes
   - Monitor blood pressure
   - Record other vital signs
   - Track general health metrics

### Optional Features
- **Notes**: Add detailed notes to any tracked item
- **Reminders**: Set custom reminders for tracking
- **Tags**: Organize entries with custom tags
- **Photos**: Attach photos to entries (optional)
- **Custom Categories**: Create custom tracking categories

## Technical Documentation

### Project Structure
```
app/
├── (tabs)/           # Main tab navigation
│   ├── index.tsx    # Home screen
│   ├── calendar.tsx # Calendar view
│   ├── trackers.tsx # Tracker selection
│   ├── insights.tsx # Health insights
│   └── settings.tsx # App settings
├── tracker/         # Tracker screens
│   ├── period/     # Period tracking
│   ├── sleep/      # Sleep tracking
│   ├── symptoms/   # Symptom tracking
│   ├── nutrition/  # Nutrition tracking
│   ├── mood/       # Mood tracking
│   ├── medication/ # Medication tracking
│   ├── activity/   # Activity tracking
│   └── general/    # General health tracking
├── history/        # History and reports
└── reports/        # Doctor report generation
```

### Theme System
The app supports multiple themes with a consistent design system:

1. **Available Themes**
   - Light Theme
   - Dark Theme
   - Blue Theme
   - Green Theme
   - Purple Theme

2. **Theme Properties**
   - Background colors
   - Text colors
   - Button styles
   - Card styles
   - Border colors
   - Shadow effects

3. **Customization**
   - Theme can be changed in settings
   - System theme detection
   - Custom color schemes

### Localization
The app supports multiple languages through i18n:

1. **Supported Languages**
   - English (default)
   - Spanish
   - French
   - German
   - More languages can be added

2. **String Categories**
   - Common strings
   - Tracker-specific strings
   - Settings strings
   - Alert messages
   - Error messages

### Data Storage
- Local SQLite database
- AsyncStorage for settings
- Optional data encryption
- Data export capabilities

### Doctor Reports
Generate comprehensive reports including:
- Health metrics summary
- Symptom patterns
- Medication history
- Cycle tracking data
- Sleep patterns
- Nutrition logs
- Activity records
- Mood trends

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- Xcode 14+ (for iOS development)
- Android SDK 33+ (for Android development)

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/quantfem.git
cd quantfem
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

### Building for Production
1. Configure app.json with your app details
2. Build for iOS
```bash
eas build --platform ios
```

3. Build for Android
```bash
eas build --platform android
```

### Testing
```bash
npm test
# or
yarn test
```

### Platform-Specific Testing
The app has been thoroughly tested on:
- iOS 15.0+ (iPhone 12, 13, 14, 15 series)
- Android 11+ (Samsung Galaxy S21+, Google Pixel 6, OnePlus 9)

#### Known Issues and Limitations

1. **Storage Issues**
   - iOS: SQLite storage may be inconsistent on some devices
   - Workaround: Regular data backups recommended
   - Status: Under investigation for iOS 17+

2. **Form Validation**
   - Current form validation needs enhancement
   - Some edge cases may not be properly handled
   - Status: Planned update in next release

3. **Performance Considerations**
   - Large datasets may cause slight lag on older devices
   - Calendar view performance optimization needed
   - Status: Optimization in progress

4. **Platform-Specific Behaviors**
   - iOS: Date picker behavior differs from Android
   - Android: Some animations may be less smooth
   - Status: Platform-specific refinements planned

### Testing Checklist
Before submitting a pull request, ensure:
1. **iOS Testing**
   - Test on multiple iOS devices/simulators
   - Verify data persistence
   - Check form submissions
   - Test calendar interactions
   - Verify notifications

2. **Android Testing**
   - Test on various Android versions
   - Verify storage operations
   - Check form behavior
   - Test calendar functionality
   - Verify background tasks

3. **Cross-Platform Verification**
   - Consistent UI across platforms
   - Same functionality on both OS
   - Data sync reliability
   - Theme consistency
   - Localization accuracy

### Development Environment Setup

1. **iOS Development**
   ```bash
   # Install iOS dependencies
   cd ios
   pod install
   cd ..
   
   # Start iOS simulator
   npm run ios
   ```

2. **Android Development**
   ```bash
   # Start Android emulator
   npm run android
   ```

3. **Development Tools**
   - React Native Debugger
   - Flipper for debugging
   - Chrome DevTools for web debugging

### Debugging Tips

1. **Storage Issues**
   - Use AsyncStorage debugging tools
   - Check SQLite database integrity
   - Monitor storage usage
   - Implement error logging

2. **Form Validation**
   - Use form validation libraries
   - Implement proper error handling
   - Add input sanitization
   - Test edge cases

3. **Performance Optimization**
   - Use React Native Performance Monitor
   - Implement proper list virtualization
   - Optimize image loading
   - Monitor memory usage

### Upcoming Improvements

1. **Storage System**
   - Implement robust error handling
   - Add data migration tools
   - Improve backup system
   - Add data integrity checks

2. **Form System**
   - Update validation logic
   - Add custom form components
   - Improve error messages
   - Add form state persistence

3. **UI/UX Enhancements**
   - Platform-specific optimizations
   - Improved animations
   - Better error states
   - Enhanced accessibility

## Contributing
We welcome contributions! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments
- React Native community
- Expo team
- All contributors and users 