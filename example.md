[
  {
    "name": "fullName",
    "label": "Full Name",
    "type": "text",
    "required": true,
    "placeholder": "Enter your full name"
  },
  {
    "name": "email",
    "label": "Email Address",
    "type": "email",
    "required": true,
    "placeholder": "your.email@example.com"
  },
  {
    "name": "phone",
    "label": "Phone Number",
    "type": "phone",
    "required": false,
    "placeholder": "+91 XXXXX XXXXX"
  },
  {
    "name": "address",
    "label": "Address",
    "type": "textarea",
    "required": true,
    "placeholder": "Enter your complete address"
  },
  {
    "name": "birthDate",
    "label": "Date of Birth",
    "type": "date",
    "required": true
  },
  {
    "name": "gender",
    "label": "Gender",
    "type": "select",
    "required": true,
    "options": ["Male", "Female", "Other"]
  },
  {
    "name": "agreeTerms",
    "label": "I agree to the terms and conditions",
    "type": "checkbox",
    "required": true,
    "helpText": "You must agree to proceed"
  }
]
template content:

Name: {{fullName}}
Email: {{email}}
Phone: {{phone}}
Address: {{address}}
Date of Birth: {{birthDate}}
Gender: {{gender}}
Terms Agreed: {{agreeTerms}}


user 
1.dars2005
pass: dar123