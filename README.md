- **Email Delivery:** [Nodemailer](https://nodemailer.com/) (Defaults to Ethereal Email for safe local testing)
## Getting Started
First, run the development server:
First, install the required dependencies:
```bash
npm install
```
Next, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 
When registering attendees locally, the app uses Ethereal Email to mock sending emails. Watch your terminal for the generated preview URLs to see exactly what your attendees will receive!
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
## Database Management (The Backend)
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
To view, edit, and manage your raw database records (similar to Airtable), you can use Prisma Studio. Run the following command in a new terminal window:
## Learn More
```bash
npx prisma studio
```
This will open a visual spreadsheet-like interface in your browser where you can manage `Registrants` and `Groups`.
To learn more about Next.js, take a look at the following resources:
## Going to Production
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
Before deploying your app to production:
1. Update your `.env` file with real SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) so the app sends real emails instead of using the Ethereal test accounts.
2. Consider swapping your SQLite database to a production-ready database like PostgreSQL (using Prisma Postgres or similar) if you expect high concurrent traffic, though SQLite can handle most standard event workloads efficiently!
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
