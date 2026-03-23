const axios = require('axios');

async function testFilters() {
  const filters = [
    { value: '1', label: 'This Month' },
    { value: '3', label: 'Next 3 Months' },
    { value: '6', label: 'Next 6 Months' },
    { value: '12', label: 'This Year' }
  ];

  for (const filter of filters) {
    try {
      const res = await axios.get(`http://localhost:5001/api/phase4/coming-soon?months=${filter.value}`);
      console.log(`\n${filter.label} (${filter.value} months):`);
      console.log(`  Movies found: ${res.data.movies.length}`);
      if (res.data.movies.length > 0) {
        res.data.movies.forEach(m => {
          console.log(`  - ${m.title} (${m.release_date})`);
        });
      }
    } catch (error) {
      console.error(`Error for ${filter.label}:`, error.message);
    }
  }
}

testFilters();
