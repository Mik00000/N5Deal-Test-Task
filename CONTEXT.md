Please refine the current B2B Fintech M&A dashboard designs by simplifying specific components for an MVP prototype. Keep the strict Light Mode theme, colors, and typography exactly as they are. Make the following scope-reduction changes:

SCREEN 1: PLATFORM MANAGER DASHBOARD
- Completely remove the right-hand column containing "Recent Activity" (the activity log) and "Platform Health" (the progress bars). 
- Expand the main "User Management" data table to take up the full 100% width of the layout. 

SCREEN 2: SELLER DASHBOARD
- In the "Active Mandates" table, look at the "Inquiries" column. Remove the small blue sparkline/bar-chart icons next to the numbers. Leave only the plain text numbers (e.g., "14", "7", "21").
- Keep the table clean and standard.

SCREEN 3: BUYER DASHBOARD
- Ensure the top "Investment Interests" KPI cards remain extremely simple. Do not add any background charts or complex sparklines to them—just the title, the big number, and the subtext (e.g., "+3 this week"). 
- Keep the data-heavy, text-only Asset Cards exactly as they are (no images).

The goal is to maintain the premium corporate look while ensuring every component can be easily built with standard shadcn/ui tables and cards without custom SVG data visualizations.



## UI/UX Exclusions (Strict Rules for Speed)
When implementing the visual dashboards from any reference images, strictly apply these simplifications:
- **Platform Manager Dashboard:** DO NOT build the right sidebar ("Recent Activity" and "Platform Health"). The "User Management" table must take 100% width.
- **Seller Dashboard:** DO NOT build the small chart/sparkline icons next to numbers in the "Inquiries" column. Use plain text.
- **Buyer Dashboard:** Keep KPI cards at the top extremely simple (text and numbers only, no background charts).
- **Asset Cards:** Purely data-driven text, NO images or photos.