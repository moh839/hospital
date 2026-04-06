// =============================================
// Hospital Outpatient Receipt System - Pure JavaScript
// High Contrast + Professional Medical UI
// Copy and use this JS with your existing HTML + CSS
// =============================================

class HospitalReceiptSystem {
    constructor() {
        this.currentScreen = 0;
        this.services = [];
        this.totalAmount = 500;
        this.receipts = []; // For storing generated receipts (in-memory)

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addInitialService();
        this.switchScreen(0); // Start with Dashboard
        this.updateDate();
    }

    // Update current date in top bar
    updateDate() {
        const dateEl = document.getElementById('current-date');
        if (dateEl) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = new Date().toLocaleDateString('en-IN', options);
        }
    }

    // Switch between screens (Dashboard, New Receipt, Records, Reports)
    switchScreen(screenIndex) {
        this.currentScreen = screenIndex;

        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        // Show selected screen
        const targetScreen = document.getElementById(`screen-${screenIndex}`);
        if (targetScreen) targetScreen.classList.remove('hidden');

        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (parseInt(link.dataset.screen) === screenIndex) {
                link.classList.add('active');
            }
        });

        // Update title
        const titles = ["Dashboard", "New Receipt", "Patient Records", "Reports"];
        const titleEl = document.getElementById('screen-title');
        if (titleEl) titleEl.textContent = titles[screenIndex] || "MediReceipt";
    }

    // Add a new service row dynamically
    addServiceRow(name = "Consultation Fee", amount = 500) {
        this.services.push({ name, amount });

        const container = document.getElementById('services-container');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'service-row flex items-center gap-4 mb-4';
        row.innerHTML = `
            <input type="text" class="service-name flex-1 bg-black border-4 border-[#00ffcc] text-white px-6 py-4 rounded-xl text-lg" 
                   value="${name}" onchange="hospitalSystem.updateService(this)">
            <input type="number" class="service-amount w-48 bg-black border-4 border-[#00ffcc] text-white px-6 py-4 rounded-xl text-lg text-right" 
                   value="${amount}" onchange="hospitalSystem.updateService(this)">
            <button onclick="hospitalSystem.removeServiceRow(this)" 
                    class="text-red-500 hover:text-red-400 text-3xl font-bold w-12 h-12 flex items-center justify-center">×</button>
        `;

        container.appendChild(row);
        this.calculateTotal();
    }

    // Remove a service row
    removeServiceRow(button) {
        const row = button.parentElement;
        if (row) row.remove();
        this.calculateTotal();
    }

    // Update service when input changes
    updateService(input) {
        this.calculateTotal();
    }

    // Calculate and display total amount
    calculateTotal() {
        let total = 0;
        const amountInputs = document.querySelectorAll('.service-amount');
        
        amountInputs.forEach(input => {
            total += parseFloat(input.value) || 0;
        });

        this.totalAmount = total || 500;
        
        const totalEl = document.getElementById('total-amount');
        if (totalEl) {
            totalEl.textContent = `₹${this.totalAmount}`;
        }
    }

    // Select payment mode (highlight active button)
    selectPaymentMode(button) {
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-[#00ffcc]', 'text-black');
            btn.classList.add('border-[#00ffcc]', 'text-white');
        });
        
        button.classList.add('active', 'bg-[#00ffcc]', 'text-black');
    }

    // Generate receipt and show preview
    generateReceipt() {
        const patientName = document.getElementById('patient-name')?.value.trim() || "Unknown Patient";
        const patientPhone = document.getElementById('patient-phone')?.value.trim() || "N/A";
        const doctor = document.getElementById('doctor')?.value || "General Medicine";

        const receipt = {
            id: `MR-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate()}-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toLocaleDateString('en-IN'),
            patientName: patientName,
            patientPhone: patientPhone,
            doctor: doctor,
            total: this.totalAmount,
            paymentMode: "Cash"
        };

        // Store receipt
        this.receipts.push(receipt);

        // Show receipt preview modal
        this.showReceiptModal(receipt);
    }

    // Show receipt in modal
    showReceiptModal(receipt) {
        const modal = document.getElementById('receipt-modal');
        const body = document.getElementById('receipt-body');

        if (!modal || !body) return;

        body.innerHTML = `
            <div class="text-center mb-8">
                <div style="font-size: 42px; font-weight: 900; color: #00ffcc;">MEDIRECEIPT</div>
                <div style="color: #00ffcc; font-size: 18px;">City General Hospital • Hyderabad, Telangana</div>
            </div>

            <div class="flex justify-between mb-10 text-lg">
                <div>
                    <strong>Patient:</strong> ${receipt.patientName}<br>
                    <strong>Phone:</strong> ${receipt.patientPhone}
                </div>
                <div class="text-right">
                    <strong>Date:</strong> ${receipt.date}<br>
                    <strong>Receipt ID:</strong> ${receipt.id}
                </div>
            </div>

            <div style="border: 5px solid #00ffcc; padding: 24px; border-radius: 12px; margin: 20px 0;">
                <div style="text-align: center; font-size: 32px; font-weight: 800; color: #00ffcc;">
                    Total Amount: ₹${receipt.total}
                </div>
            </div>

            <div class="text-center text-[#aaaaaa] mt-8">
                Paid via ${receipt.paymentMode}<br>
                Thank you for visiting our hospital
            </div>
        `;

        modal.style.display = 'flex';
    }

    // Close receipt modal
    closeModal() {
        const modal = document.getElementById('receipt-modal');
        if (modal) modal.style.display = 'none';
    }

    // Print the current receipt
    printReceipt() {
        window.print();
    }

    // Clear the new receipt form
    clearForm() {
        if (!confirm("Clear the entire form?")) return;

        // Clear inputs
        const nameInput = document.getElementById('patient-name');
        const ageInput = document.getElementById('patient-age');
        const phoneInput = document.getElementById('patient-phone');

        if (nameInput) nameInput.value = '';
        if (ageInput) ageInput.value = '';
        if (phoneInput) phoneInput.value = '';

        // Clear services container
        const container = document.getElementById('services-container');
        if (container) container.innerHTML = '';

        // Reset services and add one default
        this.services = [];
        this.addInitialService();
    }

    // Add one default service on load
    addInitialService() {
        this.addServiceRow("Consultation Fee", 500);
    }

    // Setup all event listeners
    setupEventListeners() {
        // Keyboard support - Enter key recalculates total
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.calculateTotal();
            }
        });

        // Example: Make nav links work if needed
        console.log('%cHospital Receipt System initialized successfully!', 'color: #00ffcc; font-weight: bold;');
    }

    // Get all stored receipts (for Patient Records screen)
    getAllReceipts() {
        return this.receipts;
    }
}

// Global instance
let hospitalSystem;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    hospitalSystem = new HospitalReceiptSystem();
    
    // Expose some methods globally for inline onclick handlers
    window.hospitalSystem = hospitalSystem;
    window.switchScreen = (n) => hospitalSystem.switchScreen(n);
    window.addServiceRow = () => hospitalSystem.addServiceRow();
    window.removeServiceRow = (btn) => hospitalSystem.removeServiceRow(btn);
    window.calculateTotal = () => hospitalSystem.calculateTotal();
    window.selectPaymentMode = (btn) => hospitalSystem.selectPaymentMode(btn);
    window.generateReceipt = () => hospitalSystem.generateReceipt();
    window.closeModal = () => hospitalSystem.closeModal();
    window.printReceipt = () => hospitalSystem.printReceipt();
    window.clearForm = () => hospitalSystem.clearForm();
});

