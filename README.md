# 🍽️ Spice & Soul Chatbot 🤖

Spice & Soul Chatbot is a friendly, conversational restaurant reservation assistant designed for an Indian dining experience.  
It provides a clean, modern chat-based interface for users to browse the menu, book tables, manage their reservations, and even join a waitlist seamlessly.  

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange)
![Netlify](https://img.shields.io/badge/Hosted%20on-Netlify-00C7B7?logo=netlify&logoColor=white)
![EmailJS](https://img.shields.io/badge/EmailJS-Email%20Automation-ff6b6b?logo=gmail&logoColor=white)

## ✨ Key Features

- 🍽️ **Interactive Menu Viewer**  
  Browse categorized, authentic menu items equipped with dietary tags.

- 💬 **Conversational Table Booking**  
  A step-by-step, intuitive chat flow that effortlessly collects guest details (Name, Validated Email & Phone, Flexible Date/Time formats, Guest Count, Dietary Preferences).

- ✨ **Comprehensive Reservation Management**  
  Users don't just book—they can seamlessly **Modify** or **Cancel** their existing reservations directly within the chat interface.

- ⏳ **Automated Waitlist System**  
  When tables reach maximum capacity, the chatbot automatically offers users the ability to join a dynamic waitlist for their requested time slot.

- 🛠️ **Real-Time Admin Dashboard**  
  A robust admin panel allowing staff to visualize live table availability, manage customer bookings (view details, postpone, or delete), and oversee the active waitlist.

- ☁️ **Cloud Backend Integration**  
  Powered by **Firebase Realtime Database** to ensure persistent storage and real-time synchronization for all reservations, shifts, and waitlist data.

- 📧 **Instant Notifications (EmailJS)**  
  Simulated and automated booking confirmations sent directly via EmailJS integration.

- 🎯 **Quick Reply Buttons**  
  Predefined chat options and clickable options significantly reduce typing effort and speed up user interaction.

- 🧠 **Smart Input Validation**  
  - Intelligent date parsing (e.g., `12-05-26`, `12/5/26`) and blocking of past dates.
  - Strict pattern validation for emails and phone numbers.
  - Enforced logic for maximum guest limits per table.

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend & Database:** Firebase Realtime Database
- **Integrations:** EmailJS (Email automation)

## 🚀 Getting Started

### Prerequisites
- Any modern web browser
- (Optional) Active internet connection for Firebase and EmailJS features to operate fully.

## ▶️ Running the Project

**🌐 Live Demo (Hosted on Netlify)**  
👉 https://spiceandsoul2.netlify.app/

**💻 Run Locally**  
1. Clone the repository  
2. Open the project folder  
3. Double-click `index.html`  

The app runs fully in your browser (no server required).

💬 Interaction Examples

### Booking a Table

```text
User: I want to book a table
Bot: Sure! For which date?
User: 12/5/26
Bot: Great! How many guests?
User: 4
Bot: Perfect. Shall I confirm your booking?
```

### Joining the Waitlist

```text
User: I'd like a table for 8 at 7:00 PM tonight.
Bot: Sorry, all tables for 8 people are fully booked at that time. Would you like to be added to the waitlist?
User: Yes
Bot: ✅ You’ve been added to the waitlist. We’ll notify you as soon as a table becomes available!
```

## 📂 Project Structure 

```text
project/
├── backend/
│   ├── firebase.js        # Firebase config and DB operations
│   └── test_logic.js      # Sandbox logic
├── public/                # Assets (Images, Icons)
├── index.html             # Main Frontend Entry
├── main.js                # Core Chatbot & UI Logic
├── style.css              # Styling and Animations
└── README.md
```

---