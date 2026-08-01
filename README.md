- Real-time analytics displaying registrations over time, attendee demographics (age, gender, industry), and marketing attribution success via interactive charts (Recharts).
- Data table views with sorting, searching, and CSV export capabilities for event organizers.
### 4. Check-in & Operations
- Dedicated `/checkin` interface for event volunteers and staff to scan QR codes and rapidly admit attendees on the day of the summit.
## 🛠️ Technology Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI/Styling:** Custom CSS with a premium glassmorphism light theme matching the event's exact brand guidelines (Orange, Deep Blue, Cyan).
- **Database:** SQLite
- **ORM:** [Prisma v7](https://www.prisma.io/) utilizing the modern `@prisma/adapter-better-sqlite3` driver adapter for optimized, edge-ready local queries.
- **Charts:** [Recharts](https://recharts.org/)
- **QR Codes:** [qrcode](https://www.npmjs.com/package/qrcode)
## 🚀 Getting Started
### Prerequisites
Make sure you have Node.js (v18+) installed on your machine.
### Installation
1. Clone the repository and navigate into the project directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Initialize the database schema and generate the Prisma Client:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
### Running the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the landing page and interact with the application.
### Managing the Database
To view, edit, and manage your raw database records (similar to Airtable), you can use Prisma Studio. Run the following command in a new terminal window:
```bash
npx prisma studio
```
This will open a visual interface at `http://localhost:5555` where you can manage `Attendees`.
## 📦 Preparing for Production
Before deploying your app to production:
1. **Email Configuration:** Update your `.env` file with real SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) so the app sends real emails instead of using the Ethereal test accounts.
2. **Database:** If you expect extremely high concurrent traffic (thousands of simultaneous registrations), consider migrating the SQLite database to a production-ready database like PostgreSQL (using Prisma Postgres).
## 📄 License
© 2026 Inspire Summit. All Rights Reserved.
