const query = require('./api/CustomerHandler');


const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://ualaigiscnylojsuplwg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbGFpZ2lzY255bG9qc3VwbHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA5NDAzMjAsImV4cCI6MjAyNjUxNjMyMH0.IJOX5P0qxazVvqZmqE22O_cVvxMwf4kRVGXxigD3FS0';
const supabase = createClient(supabaseUrl, supabaseKey);



// Example: Fetch all customers
async function getAllCustomers() {
  try {
    const { data, error } = await supabase.from('Customers').select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    return [];
  }
}

// Example: Add a new customer
async function addCustomer(name, email) {
  try {
    const { data, error } = await supabase.from('Customers').insert({ name, email });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding customer:', error.message);
    return null;
  }
}

async function updateCustomer(id, newData) {
  const { data, error } = await supabase.from('Customers').select("*").eq('id', 1);

}

// Example usage
async function main() {
  const customers = await getAllCustomers();
  console.log(customers[0]);
}

main();

