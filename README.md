# Spanish Public Procurement Data (SPPD) - Open Tenders

A comprehensive website providing transparent access to Spanish public procurement data. Built with vanilla HTML, CSS, and JavaScript for optimal GitHub Pages deployment.

## 🌟 Current Status

### ✅ Implemented Features

- **Interactive Data Visualization**: 3 charts using Chart.js (regional distribution, categories, value trends)
- **Advanced Filtering**: Date ranges, value ranges, regions, categories, and real-time search
- **Data Management**: Sortable table with pagination, CSV/JSON export
- **Responsive Design**: Mobile-friendly interface with Spanish localization
- **Real Data**: Spanish procurement tenders across 17 regions and 2 cities
- **Data Validation**: JSON validation and data integrity checks
- **Performance Optimization**: Efficient data loading and caching

### 📊 Data Fields
- Tender ID, title, description, dates, values
- Geographic data (17 Spanish autonomous communities + 2 cities)
- Categories (Construction, IT, Healthcare, etc.)
- Status tracking and contact information

## 🚀 Quick Start

1. **Clone and run locally**:
   ```bash
   git clone https://github.com/yourusername/sppd-ot.git
   cd sppd-ot
   npm start
   # Or use: python3 -m http.server 8000
   ```

2. **Deploy to GitHub Pages**:
   - Push to GitHub repository
   - Enable GitHub Pages in repository settings
   - Site will be available at `https://yourusername.github.io/sppd-ot`

## 📁 Project Structure

```
sppd-ot/
├── index.html              # Home page
├── data.html               # Data & Analytics page
├── about.html              # About page
├── faq.html                # FAQ page
├── css/                    # Stylesheets
│   ├── style.css          # Main styles
│   └── responsive.css     # Responsive design
├── js/                     # JavaScript modules
│   ├── main.js            # Main application logic
│   ├── data.js            # Data management
│   ├── charts.js          # Chart.js visualizations
│   ├── filters.js         # Filtering functionality
│   ├── utils.js           # Utility functions
│   └── region-mapping.js  # Geographic data mapping
├── data/                   # Data files
│   └── open_tenders.json  # Main dataset (5MB)
├── images/                 # Static assets
├── scripts/                # Build and validation scripts
├── package.json            # Project configuration
└── README.md               # This file
```

## 🛠️ Technical Details

- **Dependencies**: Chart.js, Font Awesome, Google Fonts (CDN)
- **Development Tools**: ESLint, Stylelint, HTML validation
- **Browser Support**: All modern browsers
- **Performance**: Optimized for fast loading with 5MB dataset
- **Accessibility**: WCAG 2.1 AA compliant
- **Code Quality**: Modular JavaScript, error handling, responsive design

## 📦 Available Scripts

- `npm start` - Start local development server
- `npm run validate:json` - Validate JSON data integrity
- `npm run validate:data` - Run comprehensive data validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for transparent public procurement data access in Spain**
