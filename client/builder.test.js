/**
 * @jest-environment jsdom
 */
const { clearAll, sendChat, addToCart, setListing, createListing} = require('./js/builder');

test('Check if chatbot response is diplayed to user', async ()=>{
    const response = await fetch('/response/gpt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: args.Message  
        })
    });
    expect(response).toBeDefined();
});

test('check if clearAll() clears the items listing', () => {
    clearAll();
    expect(document.getElementById('search-all')).toBeNull();
    expect(document.getElementById('total-cost')).toBeNull();
    expect(document.getElementById('clear-all')).toBeNull();
});

test('check if addToCart() adds items to cart', ()=>{
    clearAll();
    addToCart();
    expect(document.querySelector(".pc-builder > div")).toBeDefined();
});
