document.addEventListener("DOMContentLoaded", function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileMenuOpenIcon = document.getElementById('mobileMenuOpenIcon');
    const mobileMenuCloseIcon = document.getElementById('mobileMenuCloseIcon');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');

    function toggleMobileMenu() {
        const isOpen = mobileNav.classList.toggle('hidden');
        mobileMenuOpenIcon.classList.toggle('hidden', !isOpen);
        mobileMenuCloseIcon.classList.toggle('hidden', isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileCloseBtn.addEventListener('click', toggleMobileMenu);

    // Mobile Dropdowns
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
    mobileDropdownBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dropdownContent = this.nextElementSibling;
            const dropdownIcon = this.querySelector('.mobile-dropdown-icon');
            
            dropdownContent.classList.toggle('hidden');
            dropdownIcon.classList.toggle('rotate-180');
            
            // Close other open dropdowns
            document.querySelectorAll('.mobile-dropdown-content').forEach(content => {
                if (content !== dropdownContent && !content.classList.contains('hidden')) {
                    content.classList.add('hidden');
                    const otherIcon = content.previousElementSibling.querySelector('.mobile-dropdown-icon');
                    otherIcon.classList.remove('rotate-180');
                }
            });
        });
    });

    // Sidebar Functionality
    const toggleSidebar = document.getElementById('toggleSidebar');
    const mobileToggleSidebar = document.getElementById('mobileToggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        sidebar.style.left = '0';
        sidebarOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        sidebarOverlay.style.opacity = '1';
        // Close mobile menu if open
        if (!mobileNav.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    }

    function closeSidebarFunc() {
        sidebar.style.left = '-400px';
        sidebarOverlay.style.opacity = '0';
        setTimeout(() => {
            sidebarOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', (e) => {
            e.preventDefault();
            openSidebar();
        });
    }

    if (mobileToggleSidebar) {
        mobileToggleSidebar.addEventListener('click', (e) => {
            e.preventDefault();
            openSidebar();
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarFunc);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebarFunc);
    }

    // Close mobile menu when clicking on links
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileNav.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });

    // Theme toggle (if needed)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
        });
    }
});


//Search 


document.addEventListener('DOMContentLoaded', function() {
    // Sample forum data - in a real app, this would come from an API
    const forumData = [
        {
            id: 1,
            title: "How to prepare for final exams?",
            description: "Tips and strategies for acing your final exams from seniors",
            category: "Exam Preparation",
            replies: 24,
            author: "SeniorStudent123"
        },
        {
            id: 2,
            title: "Best resources for learning Python",
            description: "Share your favorite Python learning resources for beginners",
            category: "Programming",
            replies: 15,
            author: "CodeNewbie"
        },
        {
            id: 3,
            title: "Study group for Calculus II",
            description: "Looking for study partners for Calculus II on weekends",
            category: "Study Groups",
            replies: 8,
            author: "MathLover"
        },
        {
            id: 4,
            title: "Dealing with academic stress",
            description: "How do you manage stress during the semester?",
            category: "Mental Health",
            replies: 32,
            author: "WellnessAdvocate"
        },
        {
            id: 5,
            title: "Internship opportunities for CS students",
            description: "Current openings and application tips for CS internships",
            category: "Career Advice",
            replies: 19,
            author: "TechRecruiter"
        },
        {
            id: 6,
            title: "Best note-taking apps for students",
            description: "Comparing Notion, OneNote, Evernote and others",
            category: "Productivity",
            replies: 12,
            author: "OrganizedStudent"
        }
    ];

    // DOM Elements
    const searchButton = document.getElementById('searchButton');
    const mobileSearchButton = document.getElementById('mobileSearchButton');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const resultsContainer = document.getElementById('resultsContainer');

    // Toggle search overlay
    function toggleSearchOverlay() {
        if (searchOverlay.classList.contains('hidden')) {
            searchOverlay.classList.remove('hidden');
            setTimeout(() => {
                searchOverlay.classList.remove('opacity-0');
                searchInput.focus();
            }, 10);
        } else {
            searchOverlay.classList.add('opacity-0');
            setTimeout(() => {
                searchOverlay.classList.add('hidden');
                searchResults.classList.add('hidden');
                searchInput.value = '';
            }, 300);
        }
    }

    // Event listeners
    searchButton.addEventListener('click', toggleSearchOverlay);
    mobileSearchButton.addEventListener('click', toggleSearchOverlay);
    closeSearch.addEventListener('click', toggleSearchOverlay);

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            searchResults.classList.add('hidden');
            return;
        }

        // Filter forum data
        const filteredResults = forumData.filter(item => 
            item.title.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );

        displayResults(filteredResults);
    });

    // Display search results
    function displayResults(results) {
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    No results found. Try a different search term.
                </div>
            `;
            searchResults.classList.remove('hidden');
            return;
        }

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result-item';
            resultElement.innerHTML = `
                <h4 class="font-medium">${result.title}</h4>
                <p class="text-sm text-gray-600">${result.description}</p>
                <div class="mt-2 flex items-center gap-2">
                    <span class="badge">${result.category}</span>
                    <span class="text-xs text-gray-500">${result.replies} replies</span>
                    <span class="text-xs text-gray-500">by ${result.author}</span>
                </div>
            `;
            resultElement.addEventListener('click', function() {
                // In a real app, this would navigate to the forum thread
                alert(`Navigating to: ${result.title}`);
                toggleSearchOverlay();
            });
            resultsContainer.appendChild(resultElement);
        });

        searchResults.classList.remove('hidden');
    }

    // Close search when clicking outside
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            toggleSearchOverlay();
        }
    });

    // Mobile dropdown functionality
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
    mobileDropdownBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.mobile-dropdown-icon');
            
            this.classList.toggle('active');
            content.classList.toggle('hidden');
            content.classList.toggle('active');
            
            // Toggle icon rotation
            if (content.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.getElementById('goto');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const progressRing = document.querySelector('.progress-ring');
    const progressRingCircle = document.querySelector('.progress-ring-circle');
    
    // Show the container now that JS is loaded
    backToTop.style.display = 'block';
    progressRing.style.visibility = 'visible';
    
    // Initialize progress ring to be fully offset (hidden)
    progressRingCircle.style.strokeDashoffset = 251;
    
    // Show/hide button based on scroll position
    function handleScroll() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only calculate scroll percent if we have scrollable content
        if (scrollHeight > 0) {
            const scrollPercent = (scrollPosition / scrollHeight) * 251;
            progressRingCircle.style.strokeDashoffset = 251 - scrollPercent;
        }
        
        if (scrollPosition > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // Throttle scroll events for better performance
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(handleScroll, 50);
    }, { passive: true });
    
    // Initialize scroll position on load
    window.addEventListener('load', handleScroll);
    handleScroll();
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Trigger particle explosion
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.opacity = '0.8';
            particle.style.transform = `translateY(${-Math.random() * 30}px) translateX(${(Math.random() - 0.5) * 20}px)`;
            setTimeout(() => {
                particle.style.opacity = '0';
                particle.style.transform = 'translateY(0) translateX(0)';
            }, 500);
        });
        
        // Scroll to top with smooth behavior
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Reset progress ring after scroll completes
        setTimeout(() => {
            progressRingCircle.style.strokeDashoffset = 251;
        }, 1000);
    });
});