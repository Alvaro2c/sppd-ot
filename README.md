# Spanish Public Procurement Data (SPPD) - Open Tenders

A comprehensive, interactive website providing transparent access to Spanish public procurement data. Built with vanilla HTML, CSS, and JavaScript for optimal GitHub Pages deployment.

## 🌟 Current Status

### ✅ Implemented Features

#### 📊 Data Visualization
- **Interactive Charts**: 4 comprehensive charts using Chart.js
  - Regional distribution of tenders (doughnut chart)
  - Category breakdown (bar chart)
  - Value distribution trends (line chart)
  - Status distribution (pie chart)
- **Chart Export**: Download charts as images (planned)

#### 🔍 Advanced Filtering System
- **Multi-criteria Filters**:
  - Date range selection (last 30/90 days, last year, specific years)
  - Value range filtering (€0-10K, €10K-50K, €50K-200K, €200K-1M, €1M+)
  - Region/province selection (all 17 Spanish autonomous communities)
  - Category filtering (Construction, IT Services, Healthcare, etc.)
  - Real-time search functionality
- **Smart Results**: Dynamic result count and filtering
- **Collapsible Filter Panel**: Toggle filters on/off for better UX

#### 📋 Data Management
- **Sortable Data Table**: 10 columns with ascending/descending sorting
- **Pagination**: 10 records per page with navigation
- **Export Options**: CSV and JSON export functionality
- **Responsive Design**: Mobile-friendly table with horizontal scrolling

#### 🎨 Modern Design & UX
- **Spanish Language Interface**: Complete localization in Spanish
- **Professional UI**: Clean, modern design with navy blue (#1a365d) color scheme
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Typography**: Roboto font family for optimal readability
- **Loading States**: Smooth loading animations and font loading optimization

#### 📱 Mobile Responsiveness
- **Mobile-first design** approach
- **Hamburger menu** for mobile navigation
- **Touch-friendly** interface elements
- **Optimized tables** with horizontal scrolling
- **Responsive charts** that adapt to screen size

### 📊 Sample Data

The website includes comprehensive sample data with **20 realistic Spanish procurement tenders** featuring:

- **Tender Information**: ID, title, description, publication and deadline dates
- **Financial Data**: Estimated and awarded values in EUR
- **Geographic Data**: All 17 Spanish autonomous communities
- **Categories**: 8 procurement categories (Construction, IT Services, Healthcare, Education, Transportation, Energy, Security, Consulting)
- **Status Tracking**: Active, Awarded, Closed, Cancelled
- **Contact Information**: Contracting authorities and contact details

### Data Fields
- `id`: Unique tender identifier (TND-2024-XXX format)
- `title`: Tender title in Spanish
- `description`: Detailed description in Spanish
- `publicationDate`: Publication date (YYYY-MM-DD)
- `deadline`: Submission deadline (YYYY-MM-DD)
- `estimatedValue`: Estimated contract value (EUR)
- `region`: Spanish autonomous community
- `category`: Procurement category
- `contractingAuthority`: Government entity
- `status`: Current tender status
- `bidders`: Number of participating bidders
- `awardDate`: Award date (if applicable)
- `awardedValue`: Final awarded value (if applicable)
- `winnerCompany`: Winning company (if applicable)
- `contactInfo`: Contact information

## 📁 Project Structure

```
sppd-ot/
├── index.html              # Home page (Spanish)
├── data.html               # Data & Analytics page (Spanish)
├── about.html              # About Us page (Spanish)
├── faq.html                # FAQ page (Spanish)
├── css/
│   ├── style.css           # Main stylesheet (1,150 lines)
│   └── responsive.css      # Mobile responsiveness (566 lines)
├── js/
│   ├── main.js             # Main functionality (148 lines)
│   ├── charts.js           # Chart.js implementation (337 lines)
│   ├── filters.js          # Data filtering logic (443 lines)
│   └── data.js             # Data loading and management (93 lines)
├── data/
│   └── sample-data.json    # Sample procurement data (390 lines, 20 records)
├── images/                 # Image assets (empty - favicon planned)
├── .gitignore              # Git ignore rules (160 lines)
├── LICENSE                 # MIT License
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/sppd-ot.git
   cd sppd-ot
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     ```

3. **Access the website**:
   - Navigate to `http://localhost:8000` (or the port shown)

### GitHub Pages Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial SPPD website commit"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Access your live site**:
   - Your site will be available at `https://yourusername.github.io/sppd-ot`

## 🛠️ Technical Implementation

### Dependencies
- **Chart.js**: For data visualization (CDN)
- **Font Awesome**: For icons (CDN)
- **Google Fonts**: Roboto font family (CDN)

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Optimized for fast loading (< 3 seconds)
- Efficient JavaScript with debounced search
- Responsive images and assets
- Minimal external dependencies
- Font loading optimization

### Code Quality
- **Modular JavaScript**: Separated concerns (data, charts, filters, main)
- **Error Handling**: Comprehensive error handling for data loading
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach
- **Spanish Localization**: Complete interface in Spanish

## 🔧 Customization

### Updating Data

1. **Modify sample data**:
   - Edit `data/sample-data.json` for JSON data
   - Update the `data` array with your new records
   - Ensure proper JSON structure with metadata

2. **Data format**:
   ```json
   {
     "id": "TND-2024-XXX",
     "title": "Your Tender Title",
     "description": "Detailed description",
     "publicationDate": "YYYY-MM-DD",
     "deadline": "YYYY-MM-DD",
     "estimatedValue": 1000000,
     "region": "Region Name",
     "category": "Category Name",
     "contractingAuthority": "Authority Name",
     "status": "Active",
     "bidders": 5,
     "awardDate": null,
     "awardedValue": null,
     "winnerCompany": null,
     "contactInfo": "contact@example.com"
   }
   ```

### Modifying Design

1. **Colors**: Update the color scheme in `css/style.css`:
   ```css
   :root {
     --primary-color: #1a365d;
     --background-color: #ffffff;
     --text-color: #1a365d;
   }
   ```

2. **Typography**: Change fonts in the HTML head:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;700&display=swap" rel="stylesheet">
   ```

3. **Layout**: Modify grid layouts and spacing in CSS files

### Adding New Features

1. **New Charts**: Add chart functions in `js/charts.js`
2. **Additional Filters**: Extend filter logic in `js/filters.js`
3. **New Pages**: Create new HTML files and update navigation

## 🔒 Accessibility

- **WCAG 2.1 AA** compliance
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** ratios
- **Semantic HTML** structure
- **ARIA labels** where appropriate
- **Focus management** for interactive elements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Email**: info@sppd-opentenders.org
- **Documentation**: Check the About and FAQ pages
- **Issues**: Use GitHub Issues for bug reports

## 🚀 Future Enhancements

- [ ] Real-time data integration with Spanish procurement APIs
- [ ] Advanced analytics dashboard with more chart types
- [ ] User accounts and saved searches
- [ ] API documentation for data access
- [ ] Multi-language support (English, Catalan, Basque, Galician)
- [ ] Advanced export options (Excel, PDF reports)
- [ ] Data comparison tools between regions/periods
- [ ] Notification system for new tenders
- [ ] Mobile app development
- [ ] Integration with official Spanish procurement platforms

## 📈 Current Metrics

- **Total Lines of Code**: ~3,000+ lines
- **Sample Data Records**: 20 tenders
- **Supported Regions**: 17 Spanish autonomous communities
- **Categories**: 8 procurement categories
- **Charts**: 4 interactive visualizations
- **Export Formats**: CSV, JSON
- **Browser Support**: All modern browsers
- **Mobile Responsive**: Yes
- **Accessibility**: WCAG 2.1 AA compliant

---

**Built with ❤️ for transparent public procurement data access in Spain**
