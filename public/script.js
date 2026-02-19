// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/auth';

// Global variables
let currentUser = null;
let currentPage = 1;
let totalPages = 1;
let searchQuery = '';
let roleFilter = '';

// DOM Elements
const loginSection = document.getElementById('loginSection');
const userManagementSection = document.getElementById('userManagementSection');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const addUserBtn = document.getElementById('addUserBtn');
const userModal = document.getElementById('userModal');
const userForm = document.getElementById('userForm');
const modalTitle = document.getElementById('modalTitle');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('.close');
const searchInput = document.getElementById('searchInput');
const roleFilterSelect = document.getElementById('roleFilter');
const usersTableBody = document.getElementById('usersTableBody');
const pagination = document.getElementById('pagination');
const notification = document.getElementById('notification');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', showLogin);
    logoutBtn.addEventListener('click', logout);
    loginForm.addEventListener('submit', handleLogin);
    addUserBtn.addEventListener('click', showAddUserModal);
    userForm.addEventListener('submit', handleUserSubmit);
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    roleFilterSelect.addEventListener('change', handleRoleFilter);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === userModal) {
            closeModal();
        }
    });
}

// Authentication functions
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        showUserManagement();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginSection.style.display = 'block';
    userManagementSection.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
}

function showUserManagement() {
    loginSection.style.display = 'none';
    userManagementSection.style.display = 'block';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    loadUsers();
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            currentUser = result.user;
            showUserManagement();
            showNotification('Login successful!', 'success');
        } else {
            showNotification(result.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    showLogin();
    showNotification('Logged out successfully', 'success');
}

// User management functions
async function loadUsers(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            page: page.toString(),
            limit: '10'
        });
        
        if (searchQuery) params.append('search', searchQuery);
        if (roleFilter) params.append('role', roleFilter);
        
        const response = await fetch(`${API_BASE_URL}/users?${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayUsers(result.users);
            displayPagination(result.currentPage, result.totalPages, result.hasNextPage, result.hasPrevPage);
            currentPage = result.currentPage;
            totalPages = result.totalPages;
        } else {
            showNotification(result.message || 'Failed to load users', 'error');
        }
    } catch (error) {
        console.error('Load users error:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

function displayUsers(users) {
    usersTableBody.innerHTML = '';
    
    if (users.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users found</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="role-badge role-${user.role}">${user.role}</span></td>
            <td><span class="status-badge status-${user.status || 'active'}">${user.status || 'active'}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="editUser('${user._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
                </div>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

function displayPagination(currentPage, totalPages, hasNextPage, hasPrevPage) {
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = !hasPrevPage;
    prevBtn.onclick = () => loadUsers(currentPage - 1);
    pagination.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.onclick = () => loadUsers(i);
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            pagination.appendChild(dots);
        }
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = !hasNextPage;
    nextBtn.onclick = () => loadUsers(currentPage + 1);
    pagination.appendChild(nextBtn);
}

// Modal functions
function showAddUserModal() {
    modalTitle.textContent = 'Add User';
    userForm.reset();
    userModal.style.display = 'block';
}

function closeModal() {
    userModal.style.display = 'none';
    userForm.reset();
}

async function handleUserSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(userForm);
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
    };
    
    console.log('Submitting user data:', userData);
    console.log('API endpoint:', `${API_BASE_URL}/create-user`);
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response URL:', response.url);
        
        const result = await response.json();
        
        if (result.success) {
            closeModal();
            loadUsers();
            showNotification('User created successfully!', 'success');
        } else {
            showNotification(result.message || 'Failed to create user', 'error');
        }
    } catch (error) {
        console.error('Create user error:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Search and filter functions
function handleSearch(e) {
    searchQuery = e.target.value;
    loadUsers(1);
}

function handleRoleFilter(e) {
    roleFilter = e.target.value;
    loadUsers(1);
}

// Edit and delete functions (placeholders for future implementation)
function editUser(userId) {
    showNotification('Edit functionality coming soon!', 'warning');
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            loadUsers();
            showNotification('User deleted successfully!', 'success');
        } else {
            showNotification(result.message || 'Failed to delete user', 'error');
        }
    } catch (error) {
        console.error('Delete user error:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Utility functions
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
