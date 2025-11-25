import React, { useState, useEffect } from 'react';
import { Scan, PackagePlus, PackageMinus, List, History, User, Shield, LogOut } from 'lucide-react';
import logoBSE from './assets/logo-bse-horizontal.svg';
import Scanner from './components/Scanner';
import InventoryList from './components/InventoryList';
import BrandFooter from './components/BrandFooter';
import Badge from './components/Badge';

function App() {
    // --- State Management ---
    // User Role: Controls access level (null = not logged in, 'admin' = full access, 'user' = restricted)
    const [userRole, setUserRole] = useState(null);
    // View: Controls the current screen displayed (dashboard, add, remove, list)
    const [view, setView] = useState('dashboard');
    // Inventory: Array of stock items. Initialized from localStorage if available.
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('inventory');
        return saved ? JSON.parse(saved) : [];
    });

    // Admin prompt state
    const [showAdminPrompt, setShowAdminPrompt] = useState(false);
    const [adminName, setAdminName] = useState('');

    // --- Effects ---
    // Persist inventory changes to localStorage whenever the inventory state updates.
    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }, [inventory]);

    // --- Handlers ---
    /**
     * Handles the result of a QR scan.
     * @param {string} decodedText - The raw text scanned from the QR code (assumed to be Item ID).
     * @param {string} mode - The current operation mode ('add' or 'remove').
     */
    const handleScan = (decodedText, mode) => {
        console.log(`Scanned ${decodedText} in ${mode} mode`);

        if (mode === 'add') {
            // Check if item already exists in inventory
            const existingItemIndex = inventory.findIndex(item => item.id === decodedText);

            if (existingItemIndex > -1) {
                // Item exists: Increment quantity
                const newInventory = [...inventory];
                newInventory[existingItemIndex].quantity += 1;
                setInventory(newInventory);
                alert(`Added 1 to ${newInventory[existingItemIndex].name}. New Stock: ${newInventory[existingItemIndex].quantity} `);
            } else {
                // Item does not exist: Prompt for name and create new record
                const name = prompt("New item detected! Enter item name:");
                if (name) {
                    setInventory([...inventory, { id: decodedText, name, quantity: 1 }]);
                    alert(`Registered ${name} with 1 unit.`);
                }
            }
        } else if (mode === 'remove') {
            // Find item to remove
            const existingItemIndex = inventory.findIndex(item => item.id === decodedText);

            if (existingItemIndex > -1) {
                // Prompt user for quantity to remove
                const qtyToRemove = parseInt(prompt(`Removing ${inventory[existingItemIndex].name}. Enter quantity: `, "1") || "0");

                if (qtyToRemove > 0) {
                    const newInventory = [...inventory];
                    // Ensure we don't remove more than we have
                    if (newInventory[existingItemIndex].quantity >= qtyToRemove) {
                        newInventory[existingItemIndex].quantity -= qtyToRemove;
                        setInventory(newInventory);
                        alert(`Removed ${qtyToRemove} from ${newInventory[existingItemIndex].name}.Remaining: ${newInventory[existingItemIndex].quantity} `);
                    } else {
                        alert("Insufficient stock!");
                    }
                }
            } else {
                alert("Item not found in inventory.");
            }
        }
    };

    // Validate admin name (case-insensitive)
    const handleAdminContinue = () => {
        const normalized = adminName.trim().toLowerCase();
        const allowed = ['cody eckhardt', 'brian eckhardt'];
        if (allowed.includes(normalized)) {
            setUserRole('admin');
        } else {
            alert('Not authorized for Admin. Proceeding with Staff Access.');
            setUserRole('user');
        }
        setShowAdminPrompt(false);
        setAdminName('');
    };

    // --- Render: Role Selection Screen ---
    // If no role is selected, show the login/role chooser.
    if (!userRole) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
                    <div className="mb-6 flex justify-center">
                        <img src={logoBSE} alt="BSE Mechanical" className="h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">QR Inventory</h1>
                    <p className="text-slate-500 mb-8">Select your access level</p>
                    {showAdminPrompt ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={adminName}
                                onChange={(e) => setAdminName(e.target.value)}
                                className="w-full p-3 bg-white border-2 border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-brand-600"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAdminContinue}
                                    className="flex-1 p-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition active:scale-95"
                                >
                                    Continue as Admin
                                </button>
                                <button
                                    onClick={() => { setShowAdminPrompt(false); setAdminName(''); }}
                                    className="p-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition active:scale-95"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={() => setShowAdminPrompt(true)}
                                className="w-full p-4 bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-brand-700 transition shadow-md active:scale-95"
                            >
                                <Shield className="w-5 h-5" />
                                Admin Access
                            </button>
                            <button
                                onClick={() => setUserRole('user')}
                                className="w-full p-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition active:scale-95"
                            >
                                <User className="w-5 h-5" />
                                Staff Access
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- Render: Main Application ---
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header with Logo, Badge, and Logout */}
            <header className="bg-brand-900 text-white p-4 shadow-lg flex justify-between items-center">
                <h1 className="text-xl font-bold flex items-center gap-3">
                    <img src={logoBSE} alt="BSE Mechanical" className="h-8 rounded" />
                    <span className="sr-only">BSE Mechanical</span>
                    <span className="font-display">QR Inventory</span>
                    <Badge>Internal</Badge>
                </h1>
                <button
                    onClick={() => { setUserRole(null); setView('dashboard'); }}
                    className="text-xs bg-brand-800 hover:bg-brand-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                >
                    <LogOut className="w-3 h-3" /> Logout
                </button>
            </header>

            <main className="flex-1 p-4 max-w-md mx-auto w-full">
                {/* Dashboard View */}
                {view === 'dashboard' && (
                    <div className="grid grid-cols-1 gap-4">
                        {/* Admin Only: Add Stock Button */}
                        {userRole === 'admin' && (
                            <button onClick={() => setView('add')} className="p-6 bg-green-600 text-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 active:scale-95 transition">
                                <PackagePlus className="w-12 h-12" />
                                <span className="text-lg font-bold">Add Stock</span>
                            </button>
                        )}

                        <button onClick={() => setView('remove')} className="p-6 bg-red-600 text-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 active:scale-95 transition">
                            <PackageMinus className="w-12 h-12" />
                            <span className="text-lg font-bold">Remove Stock</span>
                        </button>

                        <button onClick={() => setView('list')} className="p-6 bg-brand-600 text-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 active:scale-95 transition">
                            <List className="w-12 h-12" />
                            <span className="text-lg font-bold">View Inventory</span>
                        </button>
                    </div>
                )}

                {/* Add Stock View (Scanner) */}
                {view === 'add' && (
                    <div className="flex flex-col h-full">
                        <h2 className="text-xl font-bold mb-4 text-center">Scan to Add</h2>
                        <Scanner onScan={(data) => handleScan(data, 'add')} />
                        <button onClick={() => setView('dashboard')} className="mt-4 p-3 bg-gray-200 rounded-lg font-semibold">Back</button>
                    </div>
                )}

                {/* Remove Stock View (Scanner) */}
                {view === 'remove' && (
                    <div className="flex flex-col h-full">
                        <h2 className="text-xl font-bold mb-4 text-center">Scan to Remove</h2>
                        <Scanner onScan={(data) => handleScan(data, 'remove')} />
                        <button onClick={() => setView('dashboard')} className="mt-4 p-3 bg-gray-200 rounded-lg font-semibold">Back</button>
                    </div>
                )}

                {/* Inventory List View */}
                {view === 'list' && (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Current Stock</h2>
                            <button onClick={() => setView('dashboard')} className="text-sm bg-gray-200 px-3 py-1 rounded">Back</button>
                        </div>
                        <InventoryList inventory={inventory} />
                    </div>
                )}
            </main>
            <BrandFooter />
        </div>
    );
}

export default App;
