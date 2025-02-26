// Show the selected tab and hide others
function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');
    
    // Add active class to the clicked button
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => {
        return btn.textContent.toLowerCase().includes(tabId);
    });
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Calculate circular culvert dimensions using Manning's equation
function calculateCircular() {
    // Get input values
    const discharge = parseFloat(document.getElementById('circular-discharge').value);
    const slope = parseFloat(document.getElementById('circular-slope').value);
    const manningN = parseFloat(document.getElementById('circular-manning').value);
    
    // Validate inputs
    if (isNaN(discharge) || isNaN(slope) || isNaN(manningN)) {
        alert('Please enter valid numerical values for all fields.');
        return;
    }
    
    if (discharge <= 0 || slope <= 0 || manningN <= 0) {
        alert('All values must be greater than zero.');
        return;
    }
    
    // Circular pipe calculations using Manning's equation
    // For a circular pipe flowing full, the hydraulic radius (R) = D/4
    // Area (A) = π * D²/4
    // Using Q = A * V and V = (1/n) * R^(2/3) * S^(1/2)
    // Substituting and solving for D:
    
    // Simplifying the calculation for diameter in English units:
    // For English units, Manning's equation includes 1.49 instead of 1.0
    const factor = Math.pow((discharge * manningN) / (0.463 * Math.sqrt(slope)), 3/8);
    const diameter = factor;
    
    // Calculate flow characteristics
    const area = Math.PI * Math.pow(diameter, 2) / 4;
    const velocity = discharge / area;
    const depth = diameter;
    
    // Display results
    document.getElementById('circular-diameter').textContent = diameter.toFixed(3);
    document.getElementById('circular-velocity').textContent = velocity.toFixed(3);
    document.getElementById('circular-area').textContent = area.toFixed(3);
    document.getElementById('circular-depth').textContent = depth.toFixed(3);
}

// Calculate box culvert dimensions using Manning's equation
function calculateBox() {
    // Get input values
    const discharge = parseFloat(document.getElementById('box-discharge').value);
    const slope = parseFloat(document.getElementById('box-slope').value);
    const manningN = parseFloat(document.getElementById('box-manning').value);
    const heightRatio = parseFloat(document.getElementById('box-height-ratio').value);
    
    // Validate inputs
    if (isNaN(discharge) || isNaN(slope) || isNaN(manningN) || isNaN(heightRatio)) {
        alert('Please enter valid numerical values for all fields.');
        return;
    }
    
    if (discharge <= 0 || slope <= 0 || manningN <= 0 || heightRatio <= 0) {
        alert('All values must be greater than zero.');
        return;
    }
    
    // Box culvert calculations using Manning's equation
    // For a box culvert flowing full with height = h and width = w
    // Hydraulic radius (R) = (w * h) / (2 * (w + h))
    // Area (A) = w * h
    // Using Q = A * V and V = (1/n) * R^(2/3) * S^(1/2)
    
    // Set h = heightRatio * w
    // Then solve for width (w)
    
    // This is an iterative solution
    let width = 0.1; // Initial guess
    let height, area, wettedPerimeter, hydraulicRadius, velocity, calculatedDischarge;
    const maxIterations = 100;
    const tolerance = 0.0001;
    
    for (let i = 0; i < maxIterations; i++) {
        height = heightRatio * width;
        area = width * height;
        wettedPerimeter = 2 * (width + height);
        hydraulicRadius = area / wettedPerimeter;
        velocity = (1.49 / manningN) * Math.pow(hydraulicRadius, 2/3) * Math.pow(slope, 1/2);
        calculatedDischarge = area * velocity;
        
        if (Math.abs(calculatedDischarge - discharge) < tolerance) {
            break;
        }
        
        // Adjust width based on discharge comparison
        width = width * Math.pow(discharge / calculatedDischarge, 0.4);
    }
    
    // Ensure dimensions are reasonable
    height = heightRatio * width;
    area = width * height;
    velocity = discharge / area;
    
    // Display results
    document.getElementById('box-width').textContent = width.toFixed(3);
    document.getElementById('box-height').textContent = height.toFixed(3);
    document.getElementById('box-velocity').textContent = velocity.toFixed(3);
    document.getElementById('box-area').textContent = area.toFixed(3);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set default tab
    showTab('circular');
});
