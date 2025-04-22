//Page1 Js

class Slider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        this.slideDuration = 6000;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        // Preload images
        this.preloadImages();
        
        // Initialize components
        this.updateSlide();
        this.startAutoSlide();
        this.setupVideoModal();
        this.addSwipeSupport();
        
        // Initialize particles only after main content is loaded
        window.addEventListener('load', () => {
            this.initParticles();
        });
        
        // Event listeners
        if (this.prevBtn && this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        this.indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const index = parseInt(indicator.getAttribute('data-index'));
                this.goToSlide(index);
            });
        });
        
        // Pause auto-slide when window loses focus
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(this.autoSlideInterval);
            } else {
                this.resetAutoSlide();
            }
        });
    }
    
    preloadImages() {
        // This is already handled by the HTML preload links
        // Additional images can be preloaded here if needed
        const images = Array.from(this.slides).map(slide => slide.src);
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    addSwipeSupport() {
        const slider = document.querySelector('.slide-wrapper');
        
        slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            clearInterval(this.autoSlideInterval);
        }, {passive: true});
        
        slider.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
            this.startAutoSlide();
        }, {passive: true});
    }
    
    handleSwipe() {
        if (this.isAnimating) return;
        
        const swipeThreshold = 50;
        
        if (this.touchStartX - this.touchEndX > swipeThreshold) {
            this.nextSlide();
        } else if (this.touchEndX - this.touchStartX > swipeThreshold) {
            this.prevSlide();
        }
    }
    
    updateSlide() {
        this.isAnimating = true;
        
        // Use requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
            this.slides.forEach((slide, index) => {
                if (index === this.currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            this.indicators.forEach((indicator, index) => {
                if (index === this.currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            this.isAnimating = false;
        });
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlide();
        this.resetAutoSlide();
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlide();
        this.resetAutoSlide();
    }
    
    goToSlide(index) {
        if (this.isAnimating) return;
        
        this.currentIndex = index;
        this.updateSlide();
        this.resetAutoSlide();
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => this.nextSlide(), this.slideDuration);
    }
    
    resetAutoSlide() {
        clearInterval(this.autoSlideInterval);
        this.startAutoSlide();
    }
    
    setupVideoModal() {
        const videoModal = document.getElementById('videoModal');
        const watchVideoBtn = document.getElementById('watchVideoBtn');
        const closeVideoBtn = document.getElementById('closeVideoBtn');
        const videoPlayer = document.getElementById('videoPlayer');
        
        if (!watchVideoBtn || !closeVideoBtn) return;
        
        watchVideoBtn.addEventListener('click', () => {
            videoModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            videoPlayer.src += '&autoplay=1';
        });
        
        closeVideoBtn.addEventListener('click', () => {
            videoModal.classList.remove('show');
            document.body.style.overflow = '';
            videoPlayer.src = videoPlayer.src.replace('&autoplay=1', '');
        });
        
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('show');
                document.body.style.overflow = '';
                videoPlayer.src = videoPlayer.src.replace('&autoplay=1', '');
            }
        });
    }
    
    initParticles() {
        const canvas = document.getElementById('particlesCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 20 : 50; // Reduced for performance
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // Smaller particles
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`; // More transparent
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create particles
        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Animation loop with optimized drawing
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            // Only connect particles if not on mobile
            if (window.innerWidth >= 768) {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 100) {
                            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance/100})`;
                            ctx.lineWidth = 0.2; // Thinner lines
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        // Handle resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                init();
            }, 200);
        });
        
        // Start everything
        resizeCanvas();
        init();
        
        // Start animation after a short delay to prioritize other content
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 500);
    }
}

// Initialize the slider when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new Slider();
});
//Page 1 Joined Comm Btn




//page 4 announcements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize wow.js for scroll animations
    new WOW({
        offset: 100,
        mobile: false,
        live: true
    }).init();

    // DOM Elements
    const container = document.getElementById('announcementsContainer');
    const newAnnouncementBtn = document.getElementById('newAnnouncementBtn');
    const announcementModal = document.getElementById('announcementModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const announcementForm = document.getElementById('announcementForm');
    
    // Sample announcements data
    let sampleAnnouncements = [
        {
            id: 1,
            title: "Midterm Exam Schedule Released",
            content: "The schedule for midterm exams has been published on the university portal. Please check your personalized schedule and report any conflicts to the academic office by Friday.",
            category: "academic",
            date: new Date().toISOString().split('T')[0],
            author: "Academic Office",
            comments: 12,
            likes: 45,
            important: true
        },
        {
            id: 2,
            title: "Career Fair Next Week - 50+ Companies Attending",
            content: "Annual campus career fair will be held on October 25-26 in the Student Center. Over 50 companies will be participating including Google, Amazon, and Microsoft. Bring multiple copies of your resume and dress professionally!",
            category: "opportunity",
            date: "2023-10-10",
            author: "Career Services",
            comments: 8,
            likes: 32,
            important: false
        },
        {
            id: 3,
            title: "Library Extended Hours During Exam Period",
            content: "Starting this week, the main library will be open until 2 AM during weekdays to accommodate students preparing for midterms. Security will be present until closing time.",
            category: "general",
            date: "2023-10-05",
            author: "Library Services",
            comments: 5,
            likes: 28,
            important: false
        }
    ];

    // Initialize with sample data
    renderAnnouncements(sampleAnnouncements);

    // Event Listeners
    newAnnouncementBtn.addEventListener('click', function() {
        this.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            this.classList.remove('animate__animated', 'animate__pulse');
            openModal();
        }, 300);
    });

    closeModalBtn.addEventListener('click', function() {
        closeModalWithAnimation();
    });

    cancelBtn.addEventListener('click', function() {
        closeModalWithAnimation();
    });
    
    announcementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });

    // Functions
    function renderAnnouncements(announcements) {
        container.innerHTML = '';
        
        announcements.forEach((announcement, index) => {
            const card = createAnnouncementCard(announcement, index);
            container.appendChild(card);
            
            // Add animation with delay
            setTimeout(() => {
                card.classList.add('animate__animated', 'animate__fadeInUp');
            }, index * 100);
        });
    }

    function createAnnouncementCard(announcement, index) {
        const card = document.createElement('div');
        const floatingClass = announcement.important ? 'floating-card' : '';
        const urgentClass = announcement.category === 'urgent' ? 'border-l-4 border-red-500' : '';
        
        card.className = `announcement-card bg-white rounded-xl shadow-md overflow-hidden ${floatingClass} ${urgentClass} relative wow`;
        card.dataset.id = announcement.id;
        
        // Determine badge color based on category
        const badgeClass = `badge badge-${announcement.category} inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3`;
        
        card.innerHTML = `
            <div class="p-7">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="${badgeClass}">${announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}</span>
                        <h3 class="mt-1 text-xl font-semibold text-gray-800">${announcement.title}</h3>
                    </div>
                    <span class="text-sm text-gray-500">${formatDate(announcement.date)}</span>
                </div>
                <p class="mt-4 text-gray-600 leading-relaxed">${announcement.content}</p>
                <div class="mt-6 flex items-center justify-between">
                    <span class="text-sm text-gray-500">Posted by <span class="font-medium">${announcement.author}</span></span>
                    <div class="flex space-x-4">
                        <button class="comment-btn flex items-center text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                            </svg>
                            <span class="comment-count">${announcement.comments}</span>
                        </button>
                        <button class="like-btn flex items-center text-gray-500 hover:text-red-500 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                            </svg>
                            <span class="like-count">${announcement.likes}</span>
                        </button>
                    </div>
                </div>
            </div>
            ${announcement.important ? '<div class="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-2 shadow-sm">IMPORTANT</div>' : ''}
        `;
        
        // Add interaction effects
        const likeBtn = card.querySelector('.like-btn');
        const commentBtn = card.querySelector('.comment-btn');
        
        likeBtn.addEventListener('click', function() {
            const announcementId = parseInt(card.dataset.id);
            const announcement = sampleAnnouncements.find(a => a.id === announcementId);
            if (announcement) {
                announcement.likes++;
                this.querySelector('.like-count').textContent = announcement.likes;
                this.classList.add('animate__animated', 'animate__heartBeat');
                setTimeout(() => {
                    this.classList.remove('animate__animated', 'animate__heartBeat');
                }, 1000);
            }
        });
        
        commentBtn.addEventListener('click', function() {
            const announcementId = parseInt(card.dataset.id);
            const announcement = sampleAnnouncements.find(a => a.id === announcementId);
            if (announcement) {
                announcement.comments++;
                this.querySelector('.comment-count').textContent = announcement.comments;
                this.classList.add('animate__animated', 'animate__bounce');
                setTimeout(() => {
                    this.classList.remove('animate__animated', 'animate__bounce');
                }, 1000);
            }
        });
        
        return card;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function openModal() {
        announcementModal.classList.remove('hidden');
        // Reset animation
        const modalContent = announcementModal.querySelector('.wow');
        modalContent.classList.remove('animate__zoomOut');
        modalContent.classList.add('animate__zoomIn');
    }

    function closeModalWithAnimation() {
        const modalContent = announcementModal.querySelector('.wow');
        modalContent.classList.remove('animate__zoomIn');
        modalContent.classList.add('animate__animated', 'animate__zoomOut');
        setTimeout(closeModal, 300);
    }

    function closeModal() {
        announcementModal.classList.add('hidden');
    }

    function handleFormSubmission() {
        const submitBtn = announcementForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            submitBtn.classList.remove('animate__animated', 'animate__pulse');
            createNewAnnouncement();
        }, 300);
    }

    function createNewAnnouncement() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const category = document.getElementById('category').value;
        
        if (!title.trim() || !content.trim()) {
            alert('Please fill in all fields');
            return;
        }
        
        const newAnnouncement = {
            id: sampleAnnouncements.length > 0 ? Math.max(...sampleAnnouncements.map(a => a.id)) + 1 : 1,
            title,
            content,
            category,
            date: new Date().toISOString().split('T')[0],
            author: "You",
            comments: 0,
            likes: 0,
            important: category === 'urgent'
        };
        
        // Save current scroll position
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add new announcement
        sampleAnnouncements.unshift(newAnnouncement);
        renderAnnouncements(sampleAnnouncements);
        
        // Reset form and close modal
        announcementForm.reset();
        closeModalWithAnimation();
        
        // Restore scroll position and highlight new card
        setTimeout(() => {
            window.scrollTo({
                top: currentScroll,
                behavior: 'auto'
            });
            
            const newCard = container.firstChild;
            if (newCard) {
                newCard.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.5)';
                setTimeout(() => {
                    newCard.style.boxShadow = '';
                }, 3000);
            }
        }, 100);
    }
});








document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const toggleButton = document.getElementById('togglePostButton');
    const postCreationCard = document.getElementById('postCreationCard');
    const toggleArrow = document.getElementById('toggleArrow');
    const submitPostButton = document.getElementById('submitPostButton');
    const postContent = document.getElementById('postContent');
    const uploadImage = document.getElementById('uploadImage');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageButton = document.getElementById('removeImageButton');
    const loadMoreButton = document.getElementById('loadMoreButton');
    const postsContainer = document.getElementById('postsContainer');
    const postTemplate = document.getElementById('postTemplate');

    // State variables
    let selectedFile = null;
    let posts = [];
    let currentUser = {
        name: "You",
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        tag: "#NewUser"
    };

    // Sample data for initial posts
    const samplePosts = [
        {
            id: generateId(),
            color: 'blue',
            hoverColor: 'purple',
            avatar: "https://randomuser.me/api/portraits/men/20.jpg",
            name: "Alex Johnson",
            time: "10 min",
            tag: "#Developer",
            content: "Just finished my first React project! Feeling accomplished. The journey was challenging but rewarding. 🚀",
            image: "https://www.etatvasoft.com/blog/wp-content/uploads/2024/01/Astro.jpg",
            tags: [
                { text: "#React", color: "blue" },
                { text: "#Programming", color: "purple" },
                { text: "#Success", color: "green" }
            ],
            likes: 15,
            liked: false,
            comments: [
                { user: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/44.jpg", text: "Great job! React is awesome!" },
                { user: "Mike Brown", avatar: "https://randomuser.me/api/portraits/men/32.jpg", text: "What resources did you use to learn?" }
            ]
        },
        {
            id: generateId(),
            color: 'purple',
            hoverColor: 'blue',
            avatar: "https://randomuser.me/api/portraits/men/15.jpg",
            name: "Michael Carter",
            time: "20 min",
            tag: "#AI Enthusiast",
            content: "Has anyone tried the new AI-powered coding assistant? It's amazing how it can generate entire functions from comments! 🤖",
            image: "https://atlasiko.com/assets/blog/ai-powered-coding-assistant.jpg",
            tags: [
                { text: "#AI", color: "purple" },
                { text: "#Technology", color: "blue" },
                { text: "#Innovation", color: "pink" }
            ],
            likes: 8,
            liked: false,
            comments: [
                { user: "Sarah Lee", avatar: "https://randomuser.me/api/portraits/women/68.jpg", text: "Which one are you using?" }
            ]
        }
    ];

    // Initialize
    posts = [...samplePosts];
    renderPosts();

    // Toggle post creation card
    toggleButton.addEventListener('click', function() {
        const isOpen = postCreationCard.classList.contains('scale-y-0');
        
        if (isOpen) {
            // Open the card
            postCreationCard.classList.remove('scale-y-0', 'h-0', 'opacity-0');
            postCreationCard.classList.add('scale-y-100', 'h-auto', 'opacity-100');
            toggleArrow.textContent = '⌃';
            postContent.focus();
        } else {
            // Close the card
            postCreationCard.classList.remove('scale-y-100', 'h-auto', 'opacity-100');
            postCreationCard.classList.add('scale-y-0', 'h-0', 'opacity-0');
            toggleArrow.textContent = '⌄';
        }
    });

    // Handle image upload
    uploadImage.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            selectedFile = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                imagePreview.src = event.target.result;
                imagePreviewContainer.classList.remove('hidden');
                imagePreviewContainer.classList.add('flex');
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Remove selected image
    removeImageButton.addEventListener('click', function() {
        selectedFile = null;
        imagePreviewContainer.classList.add('hidden');
        imagePreviewContainer.classList.remove('flex');
        uploadImage.value = '';
    });

    // Submit new post
    submitPostButton.addEventListener('click', createPost);

    // Also submit on Enter key (with Ctrl/Command)
    postContent.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            createPost();
        }
    });

    // Load more posts
    loadMoreButton.addEventListener('click', loadMorePosts);

    // Function to create a new post
    function createPost() {
        const content = postContent.value.trim();
        
        if (!content && !selectedFile) {
            // Shake animation for empty post
            postCreationCard.classList.add('animate-shake');
            setTimeout(() => {
                postCreationCard.classList.remove('animate-shake');
            }, 500);
            return;
        }

        // Create new post object
        const newPost = {
            id: generateId(),
            color: 'green',
            hoverColor: 'blue',
            avatar: currentUser.avatar,
            name: currentUser.name,
            time: "Just now",
            tag: currentUser.tag,
            content: content,
            image: selectedFile ? URL.createObjectURL(selectedFile) : null,
            tags: [
                { text: "#NewPost", color: "green" },
                { text: "#Community", color: "blue" }
            ],
            likes: 0,
            liked: false,
            comments: []
        };

        // Add to beginning of posts array
        posts.unshift(newPost);
        
        // Render posts
        renderPosts();
        
        // Reset form
        postContent.value = '';
        selectedFile = null;
        imagePreviewContainer.classList.add('hidden');
        imagePreviewContainer.classList.remove('flex');
        uploadImage.value = '';
        
        // Close the creation card
        postCreationCard.classList.remove('scale-y-100', 'h-auto', 'opacity-100');
        postCreationCard.classList.add('scale-y-0', 'h-0', 'opacity-0');
        toggleArrow.textContent = '⌄';
        
        // Show success animation
        submitPostButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-bounce-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Posted!</span>
        `;
        
        setTimeout(() => {
            submitPostButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                <span>Post</span>
            `;
        }, 2000);
    }

    // Function to render all posts
    function renderPosts() {
        postsContainer.innerHTML = '';
        
        if (posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="text-center text-gray-500 py-8 animate-fade-in">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>No posts yet. Be the first to share!</p>
                </div>
            `;
            return;
        }
        
        posts.forEach((post, index) => {
            // Create tags HTML
            const tagsHtml = post.tags.map(tag => 
                `<span class="px-3 py-1.5 bg-${tag.color}-100 text-${tag.color}-800 text-xs rounded-full hover:bg-${tag.color}-200 transition-all duration-200">${tag.text}</span>`
            ).join('');
            
            // Create image HTML if exists
            const imageHtml = post.image ? `
                <div class="relative rounded-xl overflow-hidden mb-5 h-80 bg-gray-100">
                    <img src="${post.image}" class="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            ` : '';
            
            // Create post from template
            let postHtml = postTemplate.innerHTML
                .replace(/\{color\}/g, post.color)
                .replace(/\{hoverColor\}/g, post.hoverColor)
                .replace('{avatar}', post.avatar)
                .replace('{name}', post.name)
                .replace('{time}', post.time)
                .replace('{tag}', post.tag)
                .replace('{content}', post.content)
                .replace('{imageContent}', imageHtml)
                .replace('{tags}', tagsHtml)
                .replace(/\{postId\}/g, post.id)
                .replace('{likeFill}', post.liked ? 'currentColor' : 'none')
                .replace('{likeCount}', post.likes);
            
            const div = document.createElement('div');
            div.innerHTML = postHtml;
            postsContainer.appendChild(div.firstElementChild);
            
            // Trigger animation
            setTimeout(() => {
                div.firstElementChild.classList.remove('opacity-0');
            }, index * 50);
        });
        
        // Add event listeners to all interactive elements
        addPostEventListeners();
    }

    // Function to add event listeners to posts
    function addPostEventListeners() {
        // Like buttons
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                const post = posts.find(p => p.id === postId);
                
                if (post) {
                    post.liked = !post.liked;
                    post.likes += post.liked ? 1 : -1;
                    
                    // Update like button appearance
                    const icon = this.querySelector('svg');
                    const count = this.querySelector('.like-count');
                    
                    icon.setAttribute('fill', post.liked ? 'currentColor' : 'none');
                    count.textContent = post.likes;
                    
                    // Add animation
                    this.classList.add('animate-pulse-scale');
                    setTimeout(() => {
                        this.classList.remove('animate-pulse-scale');
                    }, 500);
                }
            });
        });
        
        // Comment buttons
        document.querySelectorAll('.comment-button').forEach(button => {
            button.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                const postElement = this.closest('.bg-white');
                const commentSection = postElement.querySelector('.comment-section');
                
                commentSection.classList.toggle('hidden');
                
                // Focus comment input if showing
                if (!commentSection.classList.contains('hidden')) {
                    const commentInput = commentSection.querySelector('.comment-input');
                    setTimeout(() => {
                        commentInput.focus();
                    }, 100);
                }
            });
        });
        
        // Submit comment buttons
        document.querySelectorAll('.submit-comment').forEach(button => {
            button.addEventListener('click', function() {
                const postElement = this.closest('.bg-white');
                const commentInput = postElement.querySelector('.comment-input');
                const commentsContainer = postElement.querySelector('.comments-container');
                const commentText = commentInput.value.trim();
                
                if (commentText) {
                    const postId = postElement.querySelector('.comment-button').getAttribute('data-post-id');
                    const post = posts.find(p => p.id === postId);
                    
                    if (post) {
                        // Add new comment
                        const newComment = {
                            user: currentUser.name,
                            avatar: currentUser.avatar,
                            text: commentText
                        };
                        
                        post.comments.unshift(newComment);
                        
                        // Create comment element
                        const commentElement = document.createElement('div');
                        commentElement.className = 'comment animate-fadeIn';
                        commentElement.innerHTML = `
                            <img src="${newComment.avatar}" class="comment-avatar">
                            <div class="comment-content">
                                <span class="comment-username">${newComment.user}</span>
                                <span class="comment-text">${newComment.text}</span>
                            </div>
                        `;
                        
                        // Insert at the top of comments
                        if (commentsContainer.firstChild) {
                            commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);
                        } else {
                            commentsContainer.appendChild(commentElement);
                        }
                        
                        // Clear input
                        commentInput.value = '';
                        
                        // Add success animation
                        button.textContent = '✓';
                        button.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                        button.classList.add('bg-green-500', 'hover:bg-green-600');
                        
                        setTimeout(() => {
                            button.textContent = 'Post';
                            button.classList.remove('bg-green-500', 'hover:bg-green-600');
                            button.classList.add('bg-blue-500', 'hover:bg-blue-600');
                        }, 2000);
                    }
                }
            });
        });
        
        // Also submit comment on Enter key
        document.querySelectorAll('.comment-input').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const button = this.nextElementSibling;
                    button.click();
                }
            });
        });
        
        // Share buttons
        document.querySelectorAll('.share-button').forEach(button => {
            button.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                const post = posts.find(p => p.id === postId);
                
                if (post) {
                    // In a real app, this would open a share dialog
                    // For demo, we'll just show a tooltip
                    const originalText = this.querySelector('span').textContent;
                    this.querySelector('span').textContent = 'Copied link!';
                    
                    // Add animation
                    this.classList.add('animate-pulse-scale');
                    setTimeout(() => {
                        this.classList.remove('animate-pulse-scale');
                        this.querySelector('span').textContent = originalText;
                    }, 1500);
                }
            });
        });
    }

    // Function to load more posts
    function loadMorePosts() {
        // Show loading state
        loadMoreButton.innerHTML = `
            <span class="animate-spin">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </span>
            <span>Loading...</span>
        `;
        loadMoreButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Add sample additional posts
            const additionalPosts = [
                {
                    id: generateId(),
                    color: 'green',
                    hoverColor: 'blue',
                    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
                    name: "Sarah Williams",
                    time: "35 min",
                    tag: "#Designer",
                    content: "Just launched my new portfolio website! Check it out and let me know what you think. Feedback is appreciated! ✨",
                    image: "https://collegesofdistinction.com/wp-content/uploads/2019/06/1128112933113453.LVVrWgawQhwXvV1QyjtF_height640.png",
                    tags: [
                        { text: "#Design", color: "green" },
                        { text: "#Portfolio", color: "pink" },
                        { text: "#Creative", color: "yellow" }
                    ],
                    likes: 12,
                    liked: false,
                    comments: []
                },
                {
                    id: generateId(),
                    color: 'yellow',
                    hoverColor: 'orange',
                    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                    name: "David Kim",
                    time: "50 min",
                    tag: "#Entrepreneur",
                    content: "Excited to announce our startup just secured seed funding! The journey has just begun. #StartupLife #DreamBig",
                    image: "https://collegesofdistinction.com/wp-content/uploads/2019/06/1128112933113453.LVVrWgawQhwXvV1QyjtF_height640.png",
                    tags: [
                        { text: "#Startup", color: "yellow" },
                        { text: "#Funding", color: "blue" },
                        { text: "#Business", color: "purple" }
                    ],
                    likes: 23,
                    liked: false,
                    comments: []
                }
            ];
            
            // Add to posts array
            posts = [...posts, ...additionalPosts];
            
            // Re-render all posts (in a real app, you'd just append new ones)
            renderPosts();
            
            // Disable button (in a real app, you'd check if there are more posts to load)
            loadMoreButton.innerHTML = `
                <span class="bg-white/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </span>
                <span>No More Posts</span>
            `;
            loadMoreButton.classList.remove('from-blue-500', 'to-purple-600', 'hover:from-blue-600', 'hover:to-purple-700');
            loadMoreButton.classList.add('from-gray-400', 'to-gray-500', 'cursor-not-allowed');
        }, 1500);
    }

    // Helper function to generate unique ID
    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
});



/* Questions and About */
document.addEventListener('DOMContentLoaded', function() {
    // FAQ functionality
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                    item.querySelector('.faq-answer').style.opacity = '0';
                    item.querySelector('.faq-answer').style.paddingBottom = '0';
                }
            });
            
            // Toggle current FAQ
            if (!isActive) {
                faqItem.classList.add('active');
                const answer = faqItem.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                answer.style.paddingBottom = '20px';
            } else {
                faqItem.classList.remove('active');
                const answer = faqItem.querySelector('.faq-answer');
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.paddingBottom = '0';
            }
        });
    });

    // Animated counter
    const animateCounters = () => {
        const counters = document.querySelectorAll('.animate-counter');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target.toLocaleString();
            }
        });
    };

    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.bg-gradient-to-r');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Add hover effects to all interactive elements
    document.querySelectorAll('button, [href], input, select, textarea').forEach(el => {
        el.classList.add('transition-all', 'duration-200', 'ease-in-out');
    });
});
