/**
 * Universal Product Form Debugging Script
 * Works with any web framework (Rails, Django, Express, Flask, etc.)
 * Run this in browser console on http://localhost:3967/products/new
 */

class ProductFormDebugger {
    constructor() {
        this.baseUrl = 'http://localhost:3967';
        this.credentials = {
            email: 'east@east.com',
            password: 'password'
        };
        this.debug = true;
    }

    log(message, data = '') {
        if (this.debug) {
            console.log(`🔍 [DEBUG]: ${message}`, data);
        }
    }

    error(message, error = '') {
        console.error(`❌ [ERROR]: ${message}`, error);
    }

    success(message, data = '') {
        console.log(`✅ [SUCCESS]: ${message}`, data);
    }

    // Auto-detect framework and form structure
    detectFramework() {
        const indicators = {
            rails: document.querySelector('meta[name="csrf-token"]') || 
                   document.querySelector('input[name="authenticity_token"]'),
            django: document.querySelector('input[name="csrfmiddlewaretoken"]') ||
                    document.querySelector('[data-csrf-token]'),
            express: document.querySelector('meta[name="_csrf"]') ||
                     document.querySelector('input[name="_csrf"]'),
            flask: document.querySelector('input[name="csrf_token"]') ||
                   document.body.innerHTML.includes('flask')
        };

        for (let [framework, indicator] of Object.entries(indicators)) {
            if (indicator) {
                this.log(`Framework detected: ${framework.toUpperCase()}`);
                return framework;
            }
        }
        
        return 'unknown';
    }

    // Comprehensive form analysis
    analyzeForm() {
        const forms = document.querySelectorAll('form');
        this.log(`Found ${forms.length} form(s) on page`);

        forms.forEach((form, index) => {
            this.log(`Form ${index + 1} analysis:`, {
                action: form.action,
                method: form.method,
                enctype: form.enctype,
                id: form.id,
                class: form.className
            });

            // Analyze all form fields
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                this.log(`Field: ${input.name || input.id}`, {
                    type: input.type,
                    required: input.required,
                    value: input.value,
                    placeholder: input.placeholder
                });
            });

            // Check for validation
            if (form.checkValidity) {
                this.log(`Form ${index + 1} validity:`, form.checkValidity());
            }
        });
    }

    // Auto-login if needed
    async autoLogin() {
        try {
            // Check if already logged in
            if (document.body.innerHTML.includes('logout') || 
                document.body.innerHTML.includes('sign out') ||
                document.querySelector('[href*="logout"]')) {
                this.success('Already logged in');
                return true;
            }

            // Try multiple login endpoints
            const loginUrls = [
                '/login',
                '/signin',
                '/auth/login',
                '/users/sign_in',
                '/session/new'
            ];

            for (let url of loginUrls) {
                try {
                    const response = await fetch(this.baseUrl + url);
                    if (response.ok) {
                        this.log(`Found login endpoint: ${url}`);
                        await this.performLogin(url);
                        return true;
                    }
                } catch (e) {
                    continue;
                }
            }

            // Try to find login form on current page
            const loginForm = document.querySelector('form[action*="login"], form[action*="signin"], form[action*="auth"]');
            if (loginForm) {
                await this.fillLoginForm(loginForm);
                return true;
            }

            this.error('No login method found');
            return false;
        } catch (error) {
            this.error('Login failed', error);
            return false;
        }
    }

    async performLogin(loginUrl) {
        const loginPage = await fetch(this.baseUrl + loginUrl);
        const loginHtml = await loginPage.text();
        
        // Extract CSRF token from login page
        const csrfMatch = loginHtml.match(/csrf[_-]?token["\s]*[:=]["\s]*([^"'\s]+)/i);
        const csrfToken = csrfMatch ? csrfMatch[1] : null;

        const formData = new FormData();
        formData.append('email', this.credentials.email);
        formData.append('password', this.credentials.password);
        
        // Add CSRF token based on framework
        if (csrfToken) {
            formData.append('authenticity_token', csrfToken); // Rails
            formData.append('csrfmiddlewaretoken', csrfToken); // Django
            formData.append('_csrf', csrfToken); // Express
            formData.append('csrf_token', csrfToken); // Flask
        }

        const response = await fetch(this.baseUrl + loginUrl, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (response.ok || response.redirected) {
            this.success('Login successful');
            window.location.reload();
        } else {
            this.error('Login failed', response.status);
        }
    }

    // Fill and test product form
    async testProductForm() {
        const productForm = document.querySelector('form');
        if (!productForm) {
            this.error('No form found on page');
            return;
        }

        // Sample product data
        const productData = {
            name: 'Test Product Debug',
            description: 'This is a test product created by debug script',
            price: '99.99',
            category: 'Electronics',
            sku: 'TEST-' + Date.now(),
            quantity: '10',
            brand: 'TestBrand',
            status: 'active'
        };

        // Fill form fields
        for (let [key, value] of Object.entries(productData)) {
            const field = productForm.querySelector(`[name*="${key}"], [name*="${key.toLowerCase()}"], #${key}, #product_${key}`);
            if (field) {
                if (field.type === 'select-one') {
                    // For select fields, try to find matching option
                    const option = field.querySelector(`option[value*="${value}"], option:contains("${value}")`);
                    if (option) field.value = option.value;
                } else {
                    field.value = value;
                }
                this.log(`Filled ${key}:`, value);
                
                // Trigger change event
                field.dispatchEvent(new Event('change', { bubbles: true }));
                field.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        // Validate form
        const isValid = productForm.checkValidity ? productForm.checkValidity() : true;
        this.log('Form validation result:', isValid);

        if (!isValid) {
            const invalidFields = productForm.querySelectorAll(':invalid');
            invalidFields.forEach(field => {
                this.error(`Invalid field: ${field.name}`, field.validationMessage);
            });
        }

        return { form: productForm, isValid, data: productData };
    }

    // Network debugging
    setupNetworkDebugging() {
        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            this.log('Fetch request:', args[0]);
            try {
                const response = await originalFetch(...args);
                this.log('Fetch response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
                return response;
            } catch (error) {
                this.error('Fetch failed:', error);
                throw error;
            }
        };

        // Intercept XMLHttpRequest
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalSend = xhr.send;
            
            xhr.send = function(data) {
                console.log('🌐 XHR Request:', {
                    method: this.method || 'GET',
                    url: this.url,
                    data: data
                });
                
                xhr.addEventListener('load', function() {
                    console.log('🌐 XHR Response:', {
                        status: this.status,
                        statusText: this.statusText,
                        response: this.responseText.substring(0, 200) + '...'
                    });
                });
                
                return originalSend.call(this, data);
            };
            
            return xhr;
        };
    }

    // Comprehensive error detection
    detectErrors() {
        const errors = [];

        // Check for JavaScript errors
        window.addEventListener('error', (e) => {
            errors.push({
                type: 'JavaScript Error',
                message: e.message,
                filename: e.filename,
                line: e.lineno
            });
        });

        // Check for console errors
        const originalError = console.error;
        console.error = (...args) => {
            errors.push({
                type: 'Console Error',
                message: args.join(' ')
            });
            originalError(...args);
        };

        // Check for form validation errors
        document.addEventListener('invalid', (e) => {
            errors.push({
                type: 'Validation Error',
                field: e.target.name,
                message: e.target.validationMessage
            });
        }, true);

        return errors;
    }

    // Submit form with debugging
    async submitWithDebug(form, data) {
        this.log('Submitting form with data:', data);

        try {
            // Get form data
            const formData = new FormData(form);
            
            // Log all form data
            for (let [key, value] of formData.entries()) {
                this.log(`Form data - ${key}:`, value);
            }

            // Submit form
            const response = await fetch(form.action || window.location.href, {
                method: form.method || 'POST',
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                this.success('Form submitted successfully');
                const responseText = await response.text();
                
                // Check for success indicators
                if (responseText.includes('success') || 
                    responseText.includes('created') ||
                    response.redirected) {
                    this.success('Product created successfully');
                } else if (responseText.includes('error') || 
                          responseText.includes('invalid')) {
                    this.error('Form submission had errors');
                    console.log('Response:', responseText.substring(0, 500));
                }
            } else {
                this.error('Form submission failed', {
                    status: response.status,
                    statusText: response.statusText
                });
            }

        } catch (error) {
            this.error('Submit error:', error);
        }
    }

    // Main debugging routine
    async run() {
        this.success('Starting Product Form Debug Session');
        
        // Setup network debugging
        this.setupNetworkDebugging();
        
        // Detect framework
        const framework = this.detectFramework();
        
        // Setup error detection
        const errors = this.detectErrors();
        
        // Analyze current page
        this.analyzeForm();
        
        // Try auto-login if needed
        await this.autoLogin();
        
        // Test product form
        const formResult = await this.testProductForm();
        
        if (formResult && formResult.isValid) {
            this.log('Form is ready for submission');
            
            // Ask user if they want to submit
            if (confirm('Form filled successfully. Submit now?')) {
                await this.submitWithDebug(formResult.form, formResult.data);
            }
        }
        
        // Summary
        this.success('Debug session complete', {
            framework,
            errorsDetected: errors.length,
            formFound: !!formResult
        });
    }
}

// Auto-start debugger
const debugger = new ProductFormDebugger();

// Run immediately if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => debugger.run());
} else {
    debugger.run();
}

// Expose debugger for manual control
window.productDebugger = debugger;

console.log(`
🚀 Product Form Debugger Loaded!

Available commands:
- productDebugger.run() - Run full debug session
- productDebugger.analyzeForm() - Analyze forms only
- productDebugger.testProductForm() - Fill form with test data
- productDebugger.autoLogin() - Attempt automatic login

The debugger will auto-run, but you can control it manually with these commands.
`);