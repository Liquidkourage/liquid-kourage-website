# Google Sheets Testimonials Setup Guide

## Step 1: Get Your Google Sheet ID

1. **Open your Google Sheet** with form responses
2. **Copy the Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```
3. **Replace `YOUR_SHEET_ID_HERE`** in `google-apps-script.js`

## Step 2: Set Up Google Apps Script

1. **Go to [script.google.com](https://script.google.com)**
2. **Click "New Project"**
3. **Delete the default code** and paste the contents of `google-apps-script.js`
4. **Update the SHEET_ID** with your actual sheet ID
5. **Save the project** (Ctrl+S)

## Step 3: Deploy as Web App

1. **Click "Deploy" → "New deployment"**
2. **Choose "Web app"**
3. **Set access to "Anyone"** (for public access)
4. **Click "Deploy"**
5. **Copy the Web App URL** (you'll need this for the next step)

## Step 4: Update Your Website

1. **Open `fetch-testimonials.js`**
2. **Replace `YOUR_WEBAPP_URL`** with the URL from Step 3
3. **Add the script to your testimonials page**:

```html
<script src="fetch-testimonials.js"></script>
```

## Step 5: Test the Integration

1. **Add a test testimonial** to your Google Form
2. **Check your testimonials page** - it should automatically update
3. **Verify the formatting** matches your site's style

## Troubleshooting

### Common Issues:

1. **"Sheet not found"**: Check your Sheet ID and make sure the script has access
2. **"CORS error"**: Make sure the web app is deployed with "Anyone" access
3. **"No testimonials showing"**: Check the column names in your sheet match the script

### Column Structure Expected:

Your Google Sheet should have these columns:
- **A**: Timestamp
- **B**: Name
- **C**: Rating (1-5)
- **D**: Review/Testimonial
- **E**: Service Type

## Manual Update Option

If you prefer manual updates, you can:

1. **Export CSV** from Google Sheets
2. **Send me the data** (remove personal info first)
3. **I'll format it** for your website
4. **Update your testimonials page** manually

## Security Notes

- The web app URL will be public
- Only include testimonials you want public
- Consider adding moderation before publishing
- You can add authentication later if needed

## Next Steps

Once set up, your testimonials will:
- ✅ **Auto-update** when new form responses come in
- ✅ **Display in your site's style**
- ✅ **Include ratings and service types**
- ✅ **Refresh every 5 minutes** 