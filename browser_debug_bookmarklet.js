// Product Form Debug Bookmarklet
// Save this as a bookmark and click it on http://localhost:3967/products/new

javascript:(function(){
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 400px;
        max-height: 80vh;
        background: #1a1a1a;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        border: 2px solid #00ff00;
        border-radius: 8px;
        padding: 15px;
        z-index: 10000;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0,255,0,0.3);
    `;
    
    debugPanel.innerHTML = `
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0; color: #00ff00;">🔍 Product Form Debugger</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #ff0000; color: white; border: none; padding: 5px; cursor: pointer;">✕</button>
        </div>
        <div id="debug-output"></div>
        <div style="margin-top: 10px;">
            <button id="analyze-btn" style="background: #00ff00; color: black; border: none; padding: 8px 12px; margin: 2px; cursor: pointer; border-radius: 4px;">Analyze Form</button>
            <button id="fill-btn" style="background: #0088ff; color: white; border: none; padding: 8px 12px; margin: 2px; cursor: pointer; border-radius: 4px;">Fill Test Data</button>
            <button id="submit-btn" style="background: #ff8800; color: white; border: none; padding: 8px 12px; margin: 2px; cursor: pointer; border-radius: 4px;">Test Submit</button>
            <button id="login-btn" style="background: #8800ff; color: white; border: none; padding: 8px 12px; margin: 2px; cursor: pointer; border-radius: 4px;">Auto Login</button>
        </div>
    `;
    
    document.body.appendChild(debugPanel);
    
    const output = document.getElementById('debug-output');
    
    function log(message, type = 'info') {
        const colors = {
            info: '#00ff00',
            error: '#ff0000',
            success: '#00ff88',
            warning: '#ffaa00'
        };
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.style.color = colors[type];
        logEntry.style.marginBottom = '5px';
        logEntry.innerHTML = `[${timestamp}] ${message}`;
        output.appendChild(logEntry);
        output.scrollTop = output.scrollHeight;
    }
    
    function analyzeForm() {
        log('🔍 Analyzing page structure...', 'info');
        
        // Check for forms
        const forms = document.querySelectorAll('form');
        log(`Found ${forms.length} form(s)`, 'info');
        
        if (forms.length === 0) {
            log('❌ No forms found!', 'error');
            return null;
        }
        
        const form = forms[0];
        log(`Form action: ${form.action || 'current page'}`, 'info');
        log(`Form method: ${form.method || 'GET'}`, 'info');
        
        // Analyze fields
        const inputs = form.querySelectorAll('input, select, textarea');
        log(`Found ${inputs.length} form fields:`, 'info');
        
        const fieldData = {};
        inputs.forEach((input, index) => {
            const name = input.name || input.id || `field_${index}`;
            const type = input.type || input.tagName.toLowerCase();
            const required = input.required ? ' (required)' : '';
            
            log(`  - ${name}: ${type}${required}`, 'info');
            fieldData[name] = input;
        });
        
        // Check for CSRF tokens
        const csrfToken = form.querySelector('[name*="csrf"], [name*="token"], [name*="authenticity"]');
        if (csrfToken) {
            log(`✅ CSRF token found: ${csrfToken.name}`, 'success');
        } else {
            log('⚠️ No CSRF token detected', 'warning');
        }
        
        // Check authentication
        if (document.body.innerHTML.includes('login') || document.body.innerHTML.includes('sign in')) {
            log('⚠️ Login may be required', 'warning');
        }
        
        return { form, fieldData, csrfToken };
    }
    
    function fillTestData(formData) {
        if (!formData) {
            log('❌ No form data available. Run analyze first.', 'error');
            return;
        }
        
        log('📝 Filling form with test data...', 'info');
        
        const testData = {
            name: 'Debug Test Product ' + Date.now(),
            product_name: 'Debug Test Product ' + Date.now(),
            title: 'Debug Test Product ' + Date.now(),
            description: 'This is a test product created by the debug tool',
            product_description: 'This is a test product created by the debug tool',
            price: '99.99',
            product_price: '99.99',
            cost: '99.99',
            amount: '99.99',
            category: 'Electronics',
            product_category: 'Electronics',
            sku: 'TEST-' + Date.now(),
            product_sku: 'TEST-' + Date.now(),
            quantity: '10',
            product_quantity: '10',
            stock: '10',
            brand: 'TestBrand',
            product_brand: 'TestBrand',
            status: 'active',
            product_status: 'active'
        };
        
        let filledFields = 0;
        
        for (const [fieldName, element] of Object.entries(formData.fieldData)) {
            if (element.type === 'hidden' || fieldName.includes('csrf') || fieldName.includes('token')) {
                continue;
            }
            
            // Try to match field name with test data
            for (const [dataKey, dataValue] of Object.entries(testData)) {
                if (fieldName.toLowerCase().includes(dataKey.toLowerCase()) || 
                    dataKey.toLowerCase().includes(fieldName.toLowerCase())) {
                    
                    if (element.tagName.toLowerCase() === 'select') {
                        // Handle select elements
                        const option = element.querySelector(`option[value="${dataValue}"]`) || 
                                     element.querySelector('option:not([value=""])');
                        if (option) {
                            element.value = option.value;
                            filledFields++;
                        }
                    } else {
                        element.value = dataValue;
                        filledFields++;
                    }
                    
                    // Trigger events
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    log(`✅ Filled ${fieldName}: ${dataValue}`, 'success');
                    break;
                }
            }
        }
        
        log(`📊 Filled ${filledFields} fields`, 'info');
        
        // Validate form
        if (formData.form.checkValidity) {
            const isValid = formData.form.checkValidity();
            log(`Form validation: ${isValid ? '✅ Valid' : '❌ Invalid'}`, isValid ? 'success' : 'error');
            
            if (!isValid) {
                const invalidFields = formData.form.querySelectorAll(':invalid');
                invalidFields.forEach(field => {
                    log(`❌ Invalid: ${field.name} - ${field.validationMessage}`, 'error');
                });
            }
        }
    }
    
    function testSubmit(formData) {
        if (!formData) {
            log('❌ No form data available. Run analyze first.', 'error');
            return;
        }
        
        if (!confirm('Submit the form with test data? This will actually create a product.')) {
            log('📋 Submit cancelled by user', 'info');
            return;
        }
        
        log('🚀 Submitting form...', 'info');
        
        // Capture form submission
        const originalSubmit = formData.form.onsubmit;
        formData.form.onsubmit = function(e) {
            log('📡 Form submitted!', 'success');
            log(`Action: ${this.action}`, 'info');
            log(`Method: ${this.method}`, 'info');
            
            // Log form data
            const formDataObj = new FormData(this);
            for (let [key, value] of formDataObj.entries()) {
                log(`  ${key}: ${value}`, 'info');
            }
            
            if (originalSubmit) originalSubmit.call(this, e);
        };
        
        // Submit the form
        formData.form.submit();
    }
    
    function autoLogin() {
        log('🔐 Attempting auto-login...', 'info');
        
        const credentials = {
            email: 'east@east.com',
            password: 'password'
        };
        
        // Try to find login form on current page
        const emailField = document.querySelector('input[type="email"], input[name*="email"], input[name*="username"]');
        const passwordField = document.querySelector('input[type="password"], input[name*="password"]');
        const submitBtn = document.querySelector('input[type="submit"], button[type="submit"], button:contains("sign in"), button:contains("login")');
        
        if (emailField && passwordField) {
            log('📧 Filling login credentials...', 'info');
            emailField.value = credentials.email;
            passwordField.value = credentials.password;
            
            // Trigger events
            emailField.dispatchEvent(new Event('input', { bubbles: true }));
            passwordField.dispatchEvent(new Event('input', { bubbles: true }));
            
            if (submitBtn) {
                log('🚀 Clicking submit button...', 'info');
                setTimeout(() => submitBtn.click(), 500);
            } else {
                log('⚠️ No submit button found', 'warning');
            }
        } else {
            log('❌ No login form found on current page', 'error');
            
            // Try to navigate to login page
            const loginLinks = document.querySelectorAll('a[href*="login"], a[href*="signin"]');
            if (loginLinks.length > 0) {
                log('🔗 Found login link, navigating...', 'info');
                loginLinks[0].click();
            } else {
                log('❌ No login links found', 'error');
            }
        }
    }
    
    // Initialize
    log('🚀 Product Form Debugger loaded!', 'success');
    log('Click buttons below to debug your form', 'info');
    
    let formData = null;
    
    // Event listeners
    document.getElementById('analyze-btn').onclick = () => {
        formData = analyzeForm();
    };
    
    document.getElementById('fill-btn').onclick = () => {
        fillTestData(formData);
    };
    
    document.getElementById('submit-btn').onclick = () => {
        testSubmit(formData);
    };
    
    document.getElementById('login-btn').onclick = () => {
        autoLogin();
    };
    
    // Auto-analyze on load
    setTimeout(() => {
        formData = analyzeForm();
    }, 100);
    
})();