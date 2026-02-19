document.addEventListener("DOMContentLoaded", function () {
  var appDiv = document.getElementById('app');
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  appDiv.innerHTML = `
    <div class="container">
      <div class="left-side">
        <div class="overlay"></div>
        <div class="text-content">
          <h1>Spice & Soul</h1>
          <p>Reservations made simple</p>
        </div>
      </div>

      <div class="right-side">
        <button class="view-menu-btn" id="viewMenuBtn">
          <span>☰</span> Menu
        </button>

        <div class="chat-container">
          <div class="chat-messages" id="chatMessages"></div>
        </div>

        <div class="chat-input-container">
          <input type="text" id="chatInput" placeholder="Type your message..." />
          <button id="sendBtn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="menu-overlay" id="menuOverlay"></div>
      <div class="menu-panel" id="menuPanel">
        <div class="menu-header">
          <h2>Our Menu</h2>
          <button class="close-btn" id="closeMenuBtn">✕</button>
        </div>
        <div class="menu-content" id="menuContent"></div>
      </div>

      <button class="admin-btn" id="adminBtn">
        <span>⚙</span> Admin
      </button>

      <div class="admin-overlay" id="adminOverlay"></div>
      <div class="admin-panel" id="adminPanel">
        <div class="admin-header">
          <h2>Table Management</h2>
          <input type="date" id="adminDateInput" class="admin-date-input">
          <div class="admin-date-actions">
            <button class="waitlist-btn" id="viewWaitlistBtn">View Waitlist</button>
            <button class="waitlist-btn" id="viewTablesBtn" style="display:none; background:#e8a55c;">View Tables</button>
          </div>
          <button class="close-btn" id="closeAdminBtn">✕</button>
        </div>
        <div class="admin-content" id="adminContent">
          <div class="tables-grid" id="tablesGrid"></div>
          
          <div id="waitlistView" style="display:none;">
            <h3>Waitlist</h3>
            <div id="waitlistContent"></div>
          </div>
        </div>
      </div>
      
      <!-- Table Details Modal -->
      <div class="details-overlay" id="detailsOverlay"></div>
      <div class="details-panel" id="detailsPanel">
        <div class="details-header">
          <h3 id="detailsTitle">Table Details</h3>
          <button class="close-btn" id="closeDetailsBtn">✕</button>
        </div>
        <div class="details-content" id="detailsContent"></div>
      </div>
    </div>
  `;

  var menuData = {
    starters: [
      { name: 'Bruschetta', tags: ['veg'] },
      { name: 'Garden Salad', tags: ['veg', 'vegan', 'gluten-free'] },
      { name: 'Spring Rolls', tags: ['veg', 'spicy'] },
      { name: 'Tomato Soup', tags: ['veg', 'vegan', 'gluten-free'] },
      { name: 'Shrimp Skewers', tags: ['non-veg', 'gluten-free'] },
      { name: 'Paneer Tikka', tags: ['veg', 'spicy', 'gluten-free'] },
      { name: 'Hara Bhara Kebab', tags: ['veg'] },
      { name: 'Chicken 65', tags: ['non-veg', 'spicy'] },
      { name: 'Veg Samosa', tags: ['veg'] },
      { name: 'Fish Fry', tags: ['non-veg'] }
    ],
    mains: [
      { name: 'Grilled Salmon', tags: ['non-veg', 'gluten-free'] },
      { name: 'Margherita Pizza', tags: ['veg'] },
      { name: 'Tofu Stir Fry', tags: ['vegan', 'spicy'] },
      { name: 'Mushroom Risotto', tags: ['veg', 'gluten-free'] },
      { name: 'Grilled Chicken', tags: ['non-veg', 'gluten-free'] },
      { name: 'Lamb Chops', tags: ['non-veg'] },
      { name: 'Butter Chicken', tags: ['non-veg'] },
      { name: 'Paneer Butter Masala', tags: ['veg'] },
      { name: 'Veg Biryani', tags: ['veg', 'gluten-free'] },
      { name: 'Chicken Biryani', tags: ['non-veg', 'gluten-free'] },
      { name: 'Dal Tadka', tags: ['veg'] },
      { name: 'Palak Paneer', tags: ['veg', 'gluten-free'] }
    ],
    desserts: [
      { name: 'Gulab Jamun', tags: ['veg'] },
      { name: 'Rasgulla', tags: ['veg'] },
      { name: 'Chocolate Brownie', tags: ['veg'] },
      { name: 'Ice Cream Sundae', tags: ['veg'] }
    ],
    drinks: [
      { name: 'Masala Chai', tags: ['veg'] },
      { name: 'Cold Coffee', tags: ['veg'] },
      { name: 'Fresh Lime Soda', tags: ['veg'] },
      { name: 'Mango Lassi', tags: ['veg'] }
    ]
  };

  var bookingData = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    people: '',
    dietary: ''
  };

  var currentStep = 0;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
  }

  function normalizeDate(input) {
    var cleaned = input.trim().replace(/[\/\s\.]/g, '-');
    var parts = cleaned.split('-');

    if (parts.length !== 3) return null;

    var day = parts[0].padStart(2, '0');
    var month = parts[1].padStart(2, '0');
    var year = parts[2].length === 2 ? parts[2] : parts[2].slice(-2);

    var normalized = day + '-' + month + '-' + year;

    var d = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (
      d.getDate() != parseInt(day, 10) ||
      d.getMonth() != parseInt(month, 10) - 1
    ) {
      return null;
    }

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return null;

    return normalized;
  }
  var editField = '';

  var reservationSteps = [
    { key: 'email', question: 'Great! What is your email address?' },
    { key: 'phone', question: 'What is your phone number?' },
    { key: 'date', question: 'What date would you like to reserve? (DD-MM-YY)' },
    { key: 'time', question: 'What time would you like to reserve? ' },
    { key: 'people', question: 'How many people will be joining?' },
    { key: 'dietary', question: 'Any dietary restrictions?' }
  ];

  var steps = [
    { key: 'name', question: 'Welcome to Spice & Soul! I will help you reserve a table. May I have your name please?' }
  ];

  function addMessage(text, type) {
    var messagesDiv = document.getElementById('chatMessages');

    var wrapper = document.createElement('div');
    wrapper.className = 'message ' + type;

    var bubble = document.createElement('div');
    bubble.className = type === 'bot' ? 'bot-message' : 'user-message';
    bubble.innerText = text;

    var avatar = document.createElement('div');
    avatar.className = type === 'bot' ? 'avatar bot' : 'avatar user';

    var img = document.createElement('img');
    img.src = type === 'bot' ? './public/bot.png' : './public/user.png';
    img.alt = type;

    avatar.appendChild(img);

    if (type === 'bot') {
      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
    } else {
      wrapper.appendChild(bubble);
      wrapper.appendChild(avatar);
    }

    messagesDiv.appendChild(wrapper);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function showNextQuestion() {
    if (currentStep < steps.length) {
      var step = steps[currentStep];
      addMessage(step.question, 'bot');

      // --- QUICK OPTIONS FOR CHOICE ---
      if (step.key === 'choice') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        ['Food', 'Reservation', 'About Us', 'Nothing for now'].forEach(function (opt) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = opt;
          btn.onclick = function () {
            handleUserInput(opt);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }

      // --- QUICK OPTIONS FOR POST INFO CHOICE ---
      if (step.key === 'post_info_choice') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        ['Yes', 'No'].forEach(function (opt) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = opt;
          btn.onclick = function () {
            handleUserInput(opt);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }

      // --- QUICK OPTIONS FOR FOOD QA ---
      if (step.key === 'food_qa') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        ['Back'].forEach(function (opt) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = opt;
          btn.onclick = function () {
            handleUserInput(opt);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }

      // --- QUICK OPTIONS FOR DATE ---
      if (step.key === 'date') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        ['Today', 'Tomorrow', 'Day after tomorrow'].forEach(function (opt) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = opt;
          btn.onclick = function () {
            handleUserInput(opt);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }

      if (step.key === 'time') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        var times = ['12:00', '13:00', '18:00', '19:00', '20:00', '21:00'];
        times.forEach(function (t) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = t;
          btn.onclick = function () {
            handleUserInput(t);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
      // --- QUICK OPTIONS FOR PEOPLE ---
      if (step.key === 'people') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        var peopleCounts = ['1', '2', '3', '4', '5', '6'];
        peopleCounts.forEach(function (count) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = count;
          btn.onclick = function () {
            handleUserInput(count);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
      // --- QUICK OPTIONS FOR DIETARY ---
      if (step.key === 'dietary') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        var dietaryOptions = ['veg', 'vegan', 'non-veg', 'none'];
        dietaryOptions.forEach(function (option) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = option;
          btn.onclick = function () {
            handleUserInput(option);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    } else {
      showSummary();
    }
  }

  function showSummary() {
    var summary =
      "📋 Here's your booking summary:\n\n" +
      "👤 Name: " + bookingData.name + "\n" +
      "📧 Email: " + bookingData.email + "\n" +
      "📱 Phone: " + bookingData.phone + "\n" +
      "📅 Date: " + bookingData.date + "\n" +
      "⏰ Time: " + bookingData.time + "\n" +
      "👥 Guests: " + bookingData.people + "\n" +
      "🥗 Diet: " + bookingData.dietary;

    addMessage(summary, 'bot');

    setTimeout(function () {
      addMessage('Is everything correct?', 'bot');

      var messagesDiv = document.getElementById('chatMessages');
      var optionsDiv = document.createElement('div');
      optionsDiv.className = 'quick-options';

      ['Correct', 'Change'].forEach(function (option) {
        var btn = document.createElement('div');
        btn.className = 'quick-option';
        btn.textContent = option;
        btn.onclick = function () {
          handleUserInput(option.toLowerCase());
        };
        optionsDiv.appendChild(btn);
      });

      messagesDiv.appendChild(optionsDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 500);
  }

  function confirmBooking() {
    setTimeout(function () {
      // Use allocation logic
      var peopleCount = parseInt(bookingData.people, 10);

      // Convert DD-MM-YY to YYYY-MM-DD for storage
      var parts = bookingData.date.split('-');
      var yyyy = '20' + parts[2];
      var mm = parts[1];
      var dd = parts[0];
      var dateStr = yyyy + '-' + mm + '-' + dd;

      var yyyy = '20' + parts[2];
      var mm = parts[1];
      var dd = parts[0];
      var dateStr = yyyy + '-' + mm + '-' + dd;

      var allocatedTable = allocateTable(peopleCount, bookingData.name, dateStr, bookingData.time, bookingData);

      if (allocatedTable) {
        addMessage(
          '✅ Booking confirmed! Table #' + allocatedTable.id +
          ' (' + allocatedTable.seats + ' seater) for ' + bookingData.people +
          ' people on ' + bookingData.date + ' at ' + bookingData.time + '.\n\n' +
          '📩 Confirmation details have been sent to ' + bookingData.email +
          ' and ' + bookingData.phone + '.\n\n' +
          '✨ We can’t wait to welcome you, ' + bookingData.name +
          '! See you at Spice & Soul. 🎉',
          'bot'
        );
      } else {
        addMessage('Sorry, no tables are available for ' + peopleCount + ' people at that time. Would you like to be added to the waitlist?', 'bot');
      }

      // RESTART LOOP
      setTimeout(function () {
        steps.push({ key: 'choice', question: 'Is there anything else I can help you with?' });
        showNextQuestion();
      }, 2000);

    }, 1000);
  }

  function handleUserInput(input) {
    if (input.trim() === '') {
      return;
    }

    addMessage(input, 'user');

    // --- GLOBAL COMMANDS ---
    var lowerGlobal = input.toLowerCase();

    // Check for Menu
    if (lowerGlobal.includes('menu')) {
      renderMenu();
      var btn = document.getElementById('viewMenuBtn');
      if (btn) btn.click();
      addMessage('Here is our menu! 🍽️', 'bot');
      addMessage('You can continue with your previous request below. 👇', 'bot');
      return;
    }

    // Check for About Us
    if (lowerGlobal.includes('about') || lowerGlobal.includes('location') || lowerGlobal.includes('address')) {
      addMessage('Spice & Soul is located at 123 Flavor Street. We serve authentic cuisine with a modern twist. Open Daily 11 AM - 11 PM. 🏡', 'bot');
      addMessage('You can continue with your previous request below. 👇', 'bot');
      return;
    }
    // -----------------------

    if (currentStep < steps.length) {
      var step = steps[currentStep];

      if (step.key === 'name') {
        bookingData.name = input;
        steps.push({ key: 'choice', question: 'Hi ' + input + '! What would you like to do today?' });
      }

      if (step.key === 'choice') {
        var lower = input.toLowerCase();
        if (lower.includes('food') || lower.includes('menu')) {
          // renderMenu(); // Optional: key rendering available if needed but not auto-opening
          // var btn = document.getElementById('viewMenuBtn');
          // if (btn) btn.click();
          addMessage('You can ask me anything about our food! (Type "back" to go back)', 'bot');

          // Enter Food Q&A Mode
          steps.push({ key: 'food_qa', question: 'What would you like to know?' });
          // Note: The 'question' above might not be displayed immediately because we just added messages manually.
          // steps logic usually displays the question of the *next* step.
          // usage of steps array here is a bit tricky with the manual messages. 
          // Let's just rely on the loop.
        }
        else if (lower.includes('about')) {
          addMessage('Spice & Soul is located at 123 Flavor Street. We serve authentic cuisine with a modern twist. Open Daily 11 AM - 11 PM. 🏡', 'bot');
          steps.push({ key: 'post_info_choice', question: 'Would you like to make a reservation now?' });
        }
        else if (lower.includes('reservation')) {
          steps = steps.concat(reservationSteps);
        }
        else if (lower.includes('nothing')) {
          addMessage('Alright! Have a wonderful day! 👋', 'bot');
          return;
        }
        else {
          addMessage('Please choose one of the options: Food, Reservation, About Us, or Nothing for now.', 'bot');
          return;
        }
      }

      if (step.key === 'food_qa') {
        var lower = input.toLowerCase();
        if (lower === 'back' || lower === 'exit' || lower.includes('return')) {
          steps.push({ key: 'choice', question: 'What would you like to do next?' });
        } else {
          // --- Advanced Search Logic ---
          lower = lower.replace(/non\s+veg/g, 'non-veg');
          var tokens = lower.split(/\s+/);

          // Define categories and tags
          var categories = {
            'starters': ['starter', 'starters', 'appetizer', 'appetizers'],
            'mains': ['main', 'mains', 'entree', 'entrees', 'dinner', 'lunch'],
            'desserts': ['dessert', 'desserts', 'sweet', 'sweets'],
            'drinks': ['drink', 'drinks', 'beverage', 'beverages']
          };

          var tagKeywords = {
            'veg': ['veg', 'vegetarian'],
            'vegan': ['vegan'],
            'non-veg': ['non-veg', 'nonveg', 'meat'], // Removed specific ingredients to allow name matching
            'spicy': ['spicy', 'hot'],
            'gluten-free': ['gluten-free', 'gluten']
          };

          var searchCategories = [];
          var searchTags = [];
          var nameKeywords = [];

          tokens.forEach(function (token) {
            var matched = false;

            // Check categories
            for (var cat in categories) {
              if (categories[cat].includes(token)) {
                searchCategories.push(cat);
                matched = true;
                break;
              }
            }
            if (matched) return;

            // Check tags
            for (var tag in tagKeywords) {
              if (tagKeywords[tag].includes(token)) {
                searchTags.push(tag);
                matched = true;
                break;
              }
            }
            if (matched) return;

            // Otherwise, it's a name keyword
            // Filter out common stop words if needed, but for now keep basic
            if (!['show', 'me', 'the', 'list', 'are', 'is', 'any', 'have', 'you', 'do'].includes(token)) {
              nameKeywords.push(token);
            }
          });

          // Collect all items
          var allItems = [];
          // If specific categories are requested, only look in those
          var catsToSearch = searchCategories.length > 0 ? searchCategories : ['starters', 'mains', 'desserts', 'drinks'];

          catsToSearch.forEach(function (cat) {
            if (menuData[cat]) {
              // Add category info to item for display
              var itemsWithCat = menuData[cat].map(function (i) {
                return Object.assign({}, i, { category: cat });
              });
              allItems = allItems.concat(itemsWithCat);
            }
          });

          var found = allItems.filter(function (item) {
            // Filter by Tags (MUST match ALL requested tags)
            // Special handling for 'non-veg': item shouldn't be veg or vegan
            // Actually, best to rely on item.tags if we have them.
            // Let's refine tag matching.

            var itemTags = item.tags || [];

            var tagsMatch = searchTags.every(function (reqTag) {
              if (reqTag === 'non-veg') {
                return itemTags.includes('non-veg') || (!itemTags.includes('veg') && !itemTags.includes('vegan'));
              }
              if (reqTag === 'veg') {
                // If searching for veg, vegan items are also fine usually, but let's stick to strict 'veg' tag or 'vegan' tag?
                // Generally prompt implies 'vegetarian'.
                return itemTags.includes('veg') || itemTags.includes('vegan');
              }
              return itemTags.includes(reqTag);
            });
            if (!tagsMatch) return false;

            // Filter by Name Keywords (MUST match at least one if present, or all? Let's say all for specificity, or at least one?)
            // "Mutton dishes" -> Mutton (name keyword).
            // "Chicken Biryani" -> Chicken AND Biryani?
            // Let's try: ALL name keywords must be found in name or tags for a strict match.
            // If strict match fails for everyone, maybe relax?
            // Let's try simple AND logic for now.

            if (nameKeywords.length === 0) return true;

            var itemName = item.name.toLowerCase();
            var nameMatch = nameKeywords.every(function (kw) {
              return itemName.includes(kw) || itemTags.some(t => t.includes(kw));
            });

            return nameMatch;
          });

          if (found.length > 0) {
            var msg = 'Here are the matching items:\n';
            found.forEach(function (f) {
              msg += '- ' + f.name + ' (' + f.tags.join(', ') + ')\n';
            });
            addMessage(msg, 'bot');
          } else {
            // Fallback if no strict match
            // Maybe try OR logic for name keywords?
            addMessage('I couldn\'t find a perfect match for that. Try asking for specific categories like "starters" or tags like "spicy".', 'bot');
          }

          // Stay in this step
          steps.push({ key: 'food_qa', question: 'Anything else about the food?' });
        }
      }

      if (step.key === 'post_info_choice') {
        var lower = input.toLowerCase();
        if (lower === 'yes') {
          steps = steps.concat(reservationSteps);
        } else {
          addMessage('No problem! Let us know if you need anything else.', 'bot');
          return;
        }
      }

      if (step.key === 'date') {
        var lowerInput = input.toLowerCase();
        var dateObj = new Date();

        if (lowerInput === 'today') {
          // keep today
        } else if (lowerInput === 'tomorrow') {
          dateObj.setDate(dateObj.getDate() + 1);
        } else if (lowerInput === 'day after tomorrow' || lowerInput === 'day after') {
          dateObj.setDate(dateObj.getDate() + 2);
        } else {
          // Check if it's a manual date
          var normalized = normalizeDate(input);
          if (!normalized) {
            addMessage(
              'Please enter a valid date like 12-05-26, 12/5/26, or 12 5 26.',
              'bot'
            );
            return;
          }
          input = normalized;
          // Skip the re-formatting below if manually entered and normalized
          dateObj = null;
        }

        if (dateObj) {
          // Format to DD-MM-YY for consistency with manual input
          var d = dateObj.getDate().toString().padStart(2, '0');
          var m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
          var y = dateObj.getFullYear().toString().slice(-2);
          input = d + '-' + m + '-' + y;
        }
      }

      if (step.key === 'date') {
        // If we processed a quick option or manual input above, input is now DD-MM-YY.
        // We might want to validate it one last time or just proceed.
        var normalized = normalizeDate(input);
        if (!normalized) {
          addMessage(
            'Please enter a valid date like 12-05-26, 12/5/26, or 12 5 26.',
            'bot'
          );
          return;
        }
        input = normalized;
      }


      if (step.key === 'email' && !isValidEmail(input)) {
        addMessage('That doesn’t look like a valid email. Please try again (e.g., name@example.com).', 'bot');
        return;
      }
      if (step.key === 'phone' && !isValidPhone(input)) {
        addMessage('Please enter a valid 10-digit phone number.', 'bot');
        return;
      }
      if (step.key === 'people') {
        var count = parseInt(input, 10);
        if (isNaN(count) || count < 1 || count > 6) {
          addMessage('We currently support reservations for 1–6 guests.', 'bot');
          return;
        }
      }
      if (step.key === 'dietary') {
        var allowed = ['veg', 'vegan', 'non-veg', 'none'];
        if (!allowed.includes(input.toLowerCase())) {
          addMessage('Please choose from veg / vegan / non-veg / none.', 'bot');
          return;
        }
      }

      bookingData[step.key] = input;
      currentStep = currentStep + 1;

      setTimeout(function () {
        showNextQuestion();
      }, 500);
    } else {
      var lowerInput = input.toLowerCase();

      if (lowerInput === 'yes' || lowerInput === 'correct' || lowerInput === 'confirm') {
        confirmBooking();
      } else if (lowerInput === 'no' || lowerInput.includes('change') || lowerInput.includes('edit')) {
        setTimeout(function () {
          addMessage('What would you like to change?', 'bot');

          var messagesDiv = document.getElementById('chatMessages');
          var optionsDiv = document.createElement('div');
          optionsDiv.className = 'quick-options';

          var fields = ['name', 'email', 'phone', 'date', 'time', 'people', 'dietary'];
          fields.forEach(function (field) {
            var btn = document.createElement('div');
            btn.className = 'quick-option';
            btn.textContent = field;
            btn.onclick = function () {
              handleUserInput(field);
            };
            optionsDiv.appendChild(btn);
          });

          messagesDiv.appendChild(optionsDiv);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 500);

        editField = 'waiting';
      } else if (editField === 'waiting') {
        if (lowerInput === 'name' || lowerInput === 'email' || lowerInput === 'phone' || lowerInput === 'date' || lowerInput === 'time' || lowerInput === 'people' || lowerInput === 'dietary') {
          editField = lowerInput;
          setTimeout(function () {
            addMessage('Please provide the new ' + editField + ':', 'bot');
          }, 500);
        } else {
          setTimeout(function () {
            addMessage('Please specify: name / email / phone / date / time / people / dietary', 'bot');
          }, 500);
        }
      } else if (editField !== '' && editField !== 'waiting') {
        bookingData[editField] = input;
        var changedField = editField;
        editField = '';

        setTimeout(function () {
          addMessage('Updated ' + changedField + ' 👍', 'bot');

          // Show quick options again if applicable
          if (changedField === 'dietary') {
            addMessage('Any dietary restrictions?', 'bot');

            var messagesDiv = document.getElementById('chatMessages');
            var optionsDiv = document.createElement('div');
            optionsDiv.className = 'quick-options';

            ['veg', 'vegan', 'non-veg', 'none'].forEach(function (option) {
              var btn = document.createElement('div');
              btn.className = 'quick-option';
              btn.textContent = option;
              btn.onclick = function () {
                handleUserInput(option);
              };
              optionsDiv.appendChild(btn);
            });

            messagesDiv.appendChild(optionsDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }
          else if (changedField === 'people') {
            addMessage('How many people will be joining?', 'bot');

            var messagesDiv = document.getElementById('chatMessages');
            var optionsDiv = document.createElement('div');
            optionsDiv.className = 'quick-options';

            ['1', '2', '3', '4', '5', '6'].forEach(function (count) {
              var btn = document.createElement('div');
              btn.className = 'quick-option';
              btn.textContent = count;
              btn.onclick = function () {
                handleUserInput(count);
              };
              optionsDiv.appendChild(btn);
            });

            messagesDiv.appendChild(optionsDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }
          else if (changedField === 'time') {
            addMessage('What time works for you?', 'bot');

            var messagesDiv = document.getElementById('chatMessages');
            var optionsDiv = document.createElement('div');
            optionsDiv.className = 'quick-options';

            ['12:00', '13:00', '18:00', '19:00', '20:00', '21:00'].forEach(function (t) {
              var btn = document.createElement('div');
              btn.className = 'quick-option';
              btn.textContent = t;
              btn.onclick = function () {
                handleUserInput(t);
              };
              optionsDiv.appendChild(btn);
            });

            messagesDiv.appendChild(optionsDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }
          else {
            showSummary();
          }
        }, 500);
      } else if (lowerInput === 'yes') {
        setTimeout(function () {
          addMessage('✅ You’ve been added to the waitlist. We’ll notify you as soon as a table becomes available.', 'bot');

          // Add to waitlist logic
          // Need to reconstruct dateStr from bookingData.date (DD-MM-YY)
          var parts = bookingData.date.split('-');
          var yyyy = '20' + parts[2];
          var mm = parts[1];
          var dd = parts[0];
          var dateStr = yyyy + '-' + mm + '-' + dd;

          addToWaitlist(dateStr, bookingData);

          // RESTART LOOP
          setTimeout(function () {
            steps.push({ key: 'choice', question: 'Is there anything else I can help you with?' });
            showNextQuestion();
          }, 2000);
        }, 500);
      } else if (lowerInput === 'no') {
        setTimeout(function () {
          addMessage('No problem 😊 You can try a different date, time, or party size.', 'bot');
          // RESTART LOOP
          setTimeout(function () {
            steps.push({ key: 'choice', question: 'Is there anything else I can help you with?' });
            showNextQuestion();
          }, 2000);
        }, 500);
      } else {
        setTimeout(function () {
          addMessage('Please answer yes or no, or type "change" to edit your details.', 'bot');
        }, 500);
      }
    }
  }

  function sendMessage() {
    var input = document.getElementById('chatInput');
    var message = input.value;
    handleUserInput(message);
    input.value = '';
  }

  function renderMenu() {
    var menuContent = document.getElementById('menuContent');
    menuContent.innerHTML = '';

    var startersSection = document.createElement('div');
    startersSection.className = 'menu-section';
    var startersTitle = document.createElement('h3');
    startersTitle.textContent = 'Starters';
    startersSection.appendChild(startersTitle);

    for (var i = 0; i < menuData.starters.length; i++) {
      var item = menuData.starters[i];
      var itemDiv = document.createElement('div');
      itemDiv.className = 'menu-item';

      var itemInfo = document.createElement('div');
      itemInfo.className = 'item-info';

      var itemName = document.createElement('div');
      itemName.className = 'item-name';
      itemName.textContent = item.name;
      itemInfo.appendChild(itemName);

      var itemTags = document.createElement('div');
      itemTags.className = 'item-tags';
      for (var j = 0; j < item.tags.length; j++) {
        var tag = document.createElement('span');
        tag.className = 'tag ' + item.tags[j];
        tag.textContent = item.tags[j];
        itemTags.appendChild(tag);
      }
      itemInfo.appendChild(itemTags);

      itemDiv.appendChild(itemInfo);
      startersSection.appendChild(itemDiv);
    }

    menuContent.appendChild(startersSection);

    var mainsSection = document.createElement('div');
    mainsSection.className = 'menu-section';
    var mainsTitle = document.createElement('h3');
    mainsTitle.textContent = 'Main Courses';
    mainsSection.appendChild(mainsTitle);

    for (var i = 0; i < menuData.mains.length; i++) {
      var item = menuData.mains[i];
      var itemDiv = document.createElement('div');
      itemDiv.className = 'menu-item';

      var itemInfo = document.createElement('div');
      itemInfo.className = 'item-info';

      var itemName = document.createElement('div');
      itemName.className = 'item-name';
      itemName.textContent = item.name;
      itemInfo.appendChild(itemName);

      var itemTags = document.createElement('div');
      itemTags.className = 'item-tags';
      for (var j = 0; j < item.tags.length; j++) {
        var tag = document.createElement('span');
        tag.className = 'tag ' + item.tags[j];
        tag.textContent = item.tags[j];
        itemTags.appendChild(tag);
      }
      itemInfo.appendChild(itemTags);

      itemDiv.appendChild(itemInfo);
      mainsSection.appendChild(itemDiv);
    }

    menuContent.appendChild(mainsSection);

    // Render desserts and drinks sections
    function renderSection(title, items) {
      var section = document.createElement('div');
      section.className = 'menu-section';

      var h = document.createElement('h3');
      h.textContent = title;
      section.appendChild(h);

      items.forEach(function (item) {
        var itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';

        var itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';

        var itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = item.name;
        itemInfo.appendChild(itemName);

        var itemTags = document.createElement('div');
        itemTags.className = 'item-tags';
        item.tags.forEach(function (t) {
          var tag = document.createElement('span');
          tag.className = 'tag ' + t;
          tag.textContent = t;
          itemTags.appendChild(tag);
        });
        itemInfo.appendChild(itemTags);

        itemDiv.appendChild(itemInfo);
        section.appendChild(itemDiv);
      });

      return section;
    }

    menuContent.appendChild(renderSection('Desserts', menuData.desserts));
    menuContent.appendChild(renderSection('Drinks', menuData.drinks));
  }

  document.getElementById('sendBtn').addEventListener('click', sendMessage);

  document.getElementById('chatInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  document.getElementById('viewMenuBtn').addEventListener('click', function () {
    document.getElementById('menuOverlay').classList.add('active');
    document.getElementById('menuPanel').classList.add('active');
  });

  document.getElementById('closeMenuBtn').addEventListener('click', function () {
    document.getElementById('menuOverlay').classList.remove('active');
    document.getElementById('menuPanel').classList.remove('active');
  });

  document.getElementById('menuOverlay').addEventListener('click', function () {
    document.getElementById('menuOverlay').classList.remove('active');
    document.getElementById('menuPanel').classList.remove('active');
  });

  // --- ADMIN TABLE LOGIC ---
  // Static Table Configuration
  var tablesConfig = [
    // Row 1: 2-seater, 4-seater, 4-seater, 2-seater
    { id: 1, seats: 2 },
    { id: 2, seats: 4 },
    { id: 3, seats: 4 },
    { id: 4, seats: 2 },
    // Row 2: 2-seater, 4-seater, 4-seater, 2-seater
    { id: 5, seats: 2 },
    { id: 6, seats: 4 },
    { id: 7, seats: 4 },
    { id: 8, seats: 2 },
    // Row 3: 2-seater, 6-seater, 6-seater, 2-seater
    { id: 9, seats: 2 },
    { id: 10, seats: 6 },
    { id: 11, seats: 6 },
    { id: 12, seats: 2 }
  ];

  // Bookings Store: mapping YYYY-MM-DD -> { tableId: [ { time, duration, bookedBy, email, phone, dietary } ] }
  var bookings = {};

  // Waitlist Store: mapping YYYY-MM-DD -> [ { name, email, phone, people, time, dietary } ]
  var waitlist = {};

  // Formatter for Date Input (YYYY-MM-DD)
  function getFormattedDate(dateObj) {
    if (!dateObj) dateObj = new Date();
    var y = dateObj.getFullYear();
    var m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    var d = dateObj.getDate().toString().padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  // Set default admin date to today
  var adminDateInput = document.getElementById('adminDateInput');
  adminDateInput.value = getFormattedDate();

  function renderTables(dateStr) {
    // If no date provided, use the picker value or today
    if (!dateStr) dateStr = adminDateInput.value || getFormattedDate();

    var grid = document.getElementById('tablesGrid');
    grid.innerHTML = '';

    // Get bookings for this date
    var daysBookings = bookings[dateStr] || {};

    tablesConfig.forEach(function (table) {
      // Check if this table is booked for this date
      var tableBookings = daysBookings[table.id] || [];
      var isOccupied = tableBookings.length > 0;

      var card = document.createElement('div');
      card.className = 'table-card ' + (isOccupied ? 'occupied' : 'free');
      card.style.cursor = 'pointer';

      card.onclick = function () {
        openTableDetails(table.id, dateStr);
      };

      var num = document.createElement('div');
      num.className = 'table-number';
      num.textContent = 'Table ' + table.id;

      var seats = document.createElement('div');
      seats.className = 'table-seats';
      seats.textContent = table.seats + ' Seater';

      var status = document.createElement('div');
      status.className = 'table-status ' + (isOccupied ? 'status-occupied' : 'status-free');
      status.textContent = isOccupied ? tableBookings.length + ' Bookings' : 'Available';

      card.appendChild(num);
      card.appendChild(seats);
      card.appendChild(status);

      if (isOccupied) {
        var bookingList = document.createElement('div');
        bookingList.style.fontSize = '0.8rem';
        bookingList.style.marginTop = '8px';

        tableBookings.forEach(function (b) {
          var div = document.createElement('div');
          div.textContent = b.time + ' - ' + b.bookedBy;
          bookingList.appendChild(div);
        });

        card.appendChild(bookingList);
      }

      grid.appendChild(card);
    });
  }

  function isTimeSlotAvailable(existingBookings, requestedTimeStr, durationHours) {
    if (!existingBookings || existingBookings.length === 0) return true;

    var reqParts = requestedTimeStr.split(':');
    var reqH = parseInt(reqParts[0], 10);
    var reqM = parseInt(reqParts[1], 10);
    var reqStart = reqH * 60 + reqM;
    var reqEnd = reqStart + (durationHours * 60);

    for (var i = 0; i < existingBookings.length; i++) {
      var booking = existingBookings[i];
      var bookParts = booking.time.split(':');
      var bookH = parseInt(bookParts[0], 10);
      var bookM = parseInt(bookParts[1], 10);
      var bookStart = bookH * 60 + bookM;
      var bookEnd = bookStart + (booking.duration * 60);

      // Check overlap: (StartA < EndB) and (EndA > StartB)
      if (reqStart < bookEnd && reqEnd > bookStart) {
        return false;
      }
    }
    return true;
  }

  function allocateTable(people, name, dateStr, timeStr, fullData) {
    if (!dateStr) dateStr = getFormattedDate(); // Default to today if missing
    if (!timeStr) timeStr = "12:00"; // Default fallback

    // Get current bookings for this date to check availability
    // bookings[dateStr] is now { tableId: [Array of bookings] }
    if (!bookings[dateStr]) {
      bookings[dateStr] = {};
    }
    var daysBookings = bookings[dateStr];

    // Sort tables by seat capacity (ascending) to find smallest fitting first
    var sortedTables = tablesConfig.slice().sort((a, b) => a.seats - b.seats);

    var assignedTable = null;

    for (var i = 0; i < sortedTables.length; i++) {
      var t = sortedTables[i];

      // 1. Capacity check
      if (t.seats < people) continue;

      // 2. Availability check
      // Get existing bookings for this table on this date
      var apiBookings = daysBookings[t.id] || [];

      if (isTimeSlotAvailable(apiBookings, timeStr, 2)) {
        // Found a table!
        if (!daysBookings[t.id]) {
          daysBookings[t.id] = [];
        }

        // Save booking
        daysBookings[t.id].push({
          time: timeStr,
          duration: 2, // Fixed 2 hours for now
          bookedBy: name,
          email: fullData ? fullData.email : '',
          phone: fullData ? fullData.phone : '',
          people: people,
          dietary: fullData ? fullData.dietary : ''
        });

        assignedTable = t;
        break;
      }
    }

    // Refresh view if we are looking at the same date
    if (adminDateInput.value === dateStr) {
      renderTables(dateStr);
    }

    return assignedTable;
  }

  // Admin Panel Event Listeners
  document.getElementById('adminBtn').addEventListener('click', function () {
    renderTables();
    document.getElementById('adminOverlay').classList.add('active');
    document.getElementById('adminPanel').classList.add('active');
  });

  document.getElementById('closeAdminBtn').addEventListener('click', function () {
    document.getElementById('adminOverlay').classList.remove('active');
    document.getElementById('adminPanel').classList.remove('active');
  });

  document.getElementById('adminPanel').classList.remove('active');

  // --- NEW ADMIN FEATURES ---

  function addToWaitlist(dateStr, data) {
    if (!waitlist[dateStr]) {
      waitlist[dateStr] = [];
    }
    waitlist[dateStr].push(data);
  }

  function renderWaitlist(dateStr) {
    if (!dateStr) dateStr = adminDateInput.value || getFormattedDate();
    var list = waitlist[dateStr] || [];
    var container = document.getElementById('waitlistContent');
    container.innerHTML = '';

    if (list.length === 0) {
      container.innerHTML = '<p>No one on the waitlist for this date.</p>';
      return;
    }

    list.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'waitlist-item';

      var header = document.createElement('div');
      header.className = 'waitlist-header';
      header.innerHTML = '<span>' + item.name + ' (' + item.people + 'pp)</span> <span>' + item.time + '</span>';

      var contact = document.createElement('div');
      contact.textContent = item.phone + ' | ' + item.email;

      div.appendChild(header);
      div.appendChild(contact);
      container.appendChild(div);
    });
  }

  function openTableDetails(tableId, dateStr) {
    document.getElementById('detailsOverlay').classList.add('active');
    document.getElementById('detailsPanel').classList.add('active');

    var table = tablesConfig.find(t => t.id === tableId);
    document.getElementById('detailsTitle').textContent = 'Table ' + tableId + ' (' + table.seats + ' Seater)';

    renderBookingList(tableId, dateStr);
  }

  function renderBookingList(tableId, dateStr) {
    var content = document.getElementById('detailsContent');
    content.innerHTML = '';

    var daysBookings = bookings[dateStr] || {};
    var tableBookings = daysBookings[tableId] || [];

    if (tableBookings.length === 0) {
      content.innerHTML = '<p>No bookings for this table on this date.</p>';
      return;
    }

    // Sort by time
    tableBookings.sort((a, b) => {
      return parseInt(a.time.replace(':', '')) - parseInt(b.time.replace(':', ''));
    });

    tableBookings.forEach(function (b, index) {
      var item = document.createElement('div');
      item.className = 'booking-item';

      var header = document.createElement('div');
      header.className = 'booking-header';

      var time = document.createElement('div');
      time.className = 'booking-time';
      time.textContent = b.time + ' (' + b.duration + 'h)';

      var actions = document.createElement('div');
      actions.className = 'booking-actions';

      var editBtn = document.createElement('button');
      editBtn.className = 'action-btn btn-edit';
      editBtn.textContent = 'Postpone';
      editBtn.onclick = function () {
        postponeBooking(dateStr, tableId, index);
      };

      var delBtn = document.createElement('button');
      delBtn.className = 'action-btn btn-delete';
      delBtn.textContent = 'Delete';
      delBtn.onclick = function () {
        deleteBooking(dateStr, tableId, index);
      };

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      header.appendChild(time);
      header.appendChild(actions);

      item.appendChild(header);

      function addRow(label, val) {
        var row = document.createElement('div');
        row.className = 'booking-detail-row';
        row.innerHTML = '<strong>' + label + ':</strong> ' + (val || '-');
        item.appendChild(row);
      }

      addRow('Name', b.bookedBy);
      addRow('Phone', b.phone);
      addRow('Email', b.email);
      addRow('People', b.people);
      addRow('Diet', b.dietary);

      content.appendChild(item);
    });
  }

  function deleteBooking(dateStr, tableId, index) {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    var daysBookings = bookings[dateStr];
    if (daysBookings && daysBookings[tableId]) {
      daysBookings[tableId].splice(index, 1);
      renderBookingList(tableId, dateStr);
      renderTables(dateStr); // Refresh grid view background
    }
  }

  function postponeBooking(dateStr, tableId, index) {
    var daysBookings = bookings[dateStr];
    if (!daysBookings || !daysBookings[tableId]) return;

    var booking = daysBookings[tableId][index];
    var newTime = prompt("Enter new time (HH:MM):", booking.time);

    if (newTime && newTime !== booking.time) {
      // Check format roughly
      if (!/^\d{2}:\d{2}$/.test(newTime)) {
        alert("Invalid time format. Use HH:MM");
        return;
      }

      // Check availability for new time
      // We must temporarily remove the current booking to check if the new time works 
      // (conceptually, though actually we check against *others*)
      // Simplest: Check if new time fits with *other* bookings.

      var otherBookings = daysBookings[tableId].filter((_, i) => i !== index);

      if (isTimeSlotAvailable(otherBookings, newTime, booking.duration)) {
        booking.time = newTime;
        renderBookingList(tableId, dateStr);
        renderTables(dateStr);
        alert("Booking rescheduled to " + newTime);
      } else {
        alert("Time slot " + newTime + " is not available due to overlap.");
      }
    }
  }

  document.getElementById('closeDetailsBtn').addEventListener('click', function () {
    document.getElementById('detailsOverlay').classList.remove('active');
    document.getElementById('detailsPanel').classList.remove('active');
  });

  document.getElementById('detailsOverlay').addEventListener('click', function () {
    document.getElementById('detailsOverlay').classList.remove('active');
    document.getElementById('detailsPanel').classList.remove('active');
  });

  // Waitlist Buttons
  document.getElementById('viewWaitlistBtn').addEventListener('click', function () {
    document.getElementById('tablesGrid').style.display = 'none';
    document.getElementById('waitlistView').style.display = 'block';
    document.getElementById('viewWaitlistBtn').style.display = 'none';
    document.getElementById('viewTablesBtn').style.display = 'block';
    renderWaitlist(adminDateInput.value);
  });

  document.getElementById('viewTablesBtn').addEventListener('click', function () {
    document.getElementById('tablesGrid').style.display = 'grid';
    document.getElementById('waitlistView').style.display = 'none';
    document.getElementById('viewWaitlistBtn').style.display = 'block';
    document.getElementById('viewTablesBtn').style.display = 'none';
  });



  renderMenu();
  showNextQuestion();
});