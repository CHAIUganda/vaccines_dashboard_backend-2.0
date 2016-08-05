select 
     s.district_id, 
     s.vaccine_id, 
     s.year,
     s.month,  
     s.at_hand,
     r.minimum,
     r.maximum
     
from 
     dashboard_stock s left outer join
     dashboard_stockrequirement r on (s.district_id = r.district_id and s.vaccine_id = r.vaccine_id and s.year = r.year)
 
