# Raksana 🌱

**Raksana** is a gamified environmental sustainability app built with React Native and Expo. The app encourages users to adopt eco-friendly habits through interactive challenges, packet-based task systems, and social features like journals and leaderboards.

## 🚀 Features

### 🔐 Authentication System
- **Secure Login/Register** with JWT token management
- **Fast Authentication** using AsyncStorage for instant app startup
- **Profile Management** with user stats and settings

### 🎯 Core Gameplay
- **Packet System**: Complete environmental challenges organized in themed packets
- **Task Completion**: Interactive tasks with progress tracking and rewards
- **Leveling System**: Gain XP and level up through completing challenges
- **Daily Challenges**: Fresh daily tasks to keep users engaged

### 🏆 Social Features
- **Leaderboard**: Compete with other users and track rankings
- **Journal System**: Create and share personal environmental journey entries
- **Achievement System**: Unlock new packets and rewards

### 🎨 User Experience
- **Modern UI**: Clean, intuitive design with smooth animations
- **Tab Navigation**: Easy access to Home, Packets, Profile, and Bookmarks
- **Real-time Updates**: Live data synchronization with TanStack Query
- **Offline Support**: Cached data for seamless offline experience

### 🌍 Environmental Focus
- **Regional Content**: Location-based environmental challenges
- **Educational Content**: Learn about sustainability through interactive tasks
- **Progress Tracking**: Monitor your environmental impact over time

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo SDK 53**
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations

### State Management & Data
- **TanStack Query** for server state management
- **AsyncStorage** for local data persistence
- **Axios** for API communication
- **React Context** for global state

### UI & Styling
- **Expo Linear Gradient** for beautiful gradients
- **Expo Blur** for modern blur effects
- **Custom Components** with consistent design system
- **Moti** for declarative animations

### Development Tools
- **ESLint** for code quality
- **TypeScript** for static type checking
- **Expo Dev Tools** for debugging

## 📱 App Structure

```
app/
├── (tabs)/                 # Tab-based navigation
│   ├── index.tsx          # Home screen
│   ├── packet/            # Packet management
│   ├── profile.tsx        # User profile
│   └── bookmarks.tsx      # Saved content
├── journal/               # Journal feature
├── leaderboard/           # Leaderboard system
├── login.tsx             # Authentication
└── register.tsx          # User registration

components/
├── Home/                  # Home screen components
├── AuthGuard.tsx         # Authentication protection
├── ErrorPopup.tsx        # Error handling
└── ...                   # Reusable UI components

hooks/
├── useAuth.ts            # Authentication logic
├── useAuthQueries.ts     # Auth-related queries
└── useApiQueries.ts      # API data fetching

services/
├── api.ts                # API service layer
└── queryClient.ts        # TanStack Query configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd raksana
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

### Development Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Code quality
npm run lint
```

## 🏗️ Architecture

### Authentication Flow
- Fast auth check using AsyncStorage for instant startup
- JWT token validation with automatic refresh
- Secure logout with cache clearing

### Data Management
- TanStack Query for server state with automatic caching
- Optimistic updates for better user experience
- Background data synchronization

### Navigation Structure
- File-based routing with Expo Router
- Tab navigation for main features
- Stack navigation for detailed flows

## 🎯 Key Features Deep Dive

### Packet System
Users complete environmental challenges organized in themed packets:
- **Target-based Goals**: Each packet has specific environmental targets
- **Task Progression**: Multiple tasks per packet with completion tracking
- **Reward System**: XP, level ups, and new packet unlocks

### Gamification Elements
- **Experience Points**: Earned through task completion
- **Level System**: Progressive difficulty and rewards
- **Achievement Unlocks**: New content based on progress
- **Social Competition**: Leaderboard rankings

### Environmental Impact
- **Real-world Actions**: Tasks encourage actual environmental behavior
- **Educational Content**: Learn while completing challenges
- **Progress Visualization**: Track personal environmental impact

## 🔧 Configuration

### Environment Setup
The app uses environment-specific configurations for:
- API endpoints
- Authentication settings
- Feature flags

### Customization
- **Colors**: Defined in `constants/Colors.ts`
- **Fonts**: Custom typography in `constants/Fonts.ts`
- **API**: Service layer in `services/api.ts`

## 📚 Documentation

- **User Flow**: See `FLOWCHART.md` for detailed user journey diagrams
- **Error Handling**: Comprehensive error management with user-friendly messages
- **API Integration**: RESTful API with proper TypeScript types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
1. Check the error handling guide in `ERROR_HANDLING_GUIDE.md`
2. Review the user flow documentation in `FLOWCHART.md`
3. Contact the development team

---

**Built with ❤️ for a sustainable future** 🌍
