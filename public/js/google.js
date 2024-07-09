document.addEventListener('DOMContentLoaded', function() {
    // Mock data: Replace this with actual user data fetched from your backend or API
    const userAccounts = [
        { name: 'Unzila', email: 'rizviunzila0786@gmail.com' },
        { name: 'Unzila', email: 'unzila.2017104@gmail.com' }
    ];

    const accountOptionsContainer = document.getElementById('account-options');

    userAccounts.forEach(account => {
        const accountOption = document.createElement('div');
        accountOption.className = 'account-option';
        accountOption.onclick = () => signInWithGoogle(account.email);

        const accountDetails = document.createElement('div');
        accountDetails.className = 'account-details';

        const accountName = document.createElement('p');
        accountName.className = 'account-name';
        accountName.textContent = account.name;

        const accountEmail = document.createElement('p');
        accountEmail.className = 'account-email';
        accountEmail.textContent = account.email;

        accountDetails.appendChild(accountName);
        accountDetails.appendChild(accountEmail);
        accountOption.appendChild(accountDetails);
        accountOptionsContainer.appendChild(accountOption);
    });

    // Add "Use another account" option
    const anotherAccountOption = document.createElement('div');
    anotherAccountOption.className = 'account-option';
    anotherAccountOption.onclick = () => signInWithGoogle('other');

    const anotherAccountDetails = document.createElement('div');
    anotherAccountDetails.className = 'account-details';

    const anotherAccountEmail = document.createElement('p');
    anotherAccountEmail.className = 'account-email';
    anotherAccountEmail.textContent = 'Use another account';

    anotherAccountDetails.appendChild(anotherAccountEmail);
    anotherAccountOption.appendChild(anotherAccountDetails);
    accountOptionsContainer.appendChild(anotherAccountOption);
});

function signInWithGoogle(email) {
    if (email === 'other') {
        // Logic for handling "Use another account"
        console.log('Redirecting to Google sign-in page...');
        // Redirect to Google sign-in page for another account
        window.location.href = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?...';
    } else {
        // Logic for handling specific account sign-in
        console.log(`Signing in with ${email}...`);
        // Perform necessary actions, like redirecting to the OAuth flow
        window.location.href = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?...';
    }
}
