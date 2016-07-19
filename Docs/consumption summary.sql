SELECT 
  dashboard_district.name AS district, 
  dashboard_dataelement.name vaccine, 
  SUM(dashboard_datavalue.value)
FROM 
  public.dashboard_datavalue, 
  public.dashboard_dataelement, 
  public.dashboard_district
WHERE 
  dashboard_datavalue.district_id = dashboard_district.id AND
  dashboard_datavalue.data_element_id = dashboard_dataelement.id
  AND dashboard_dataelement.name LIKE '%Mea%'
GROUP BY 
  dashboard_district.name,
  dashboard_dataelement.name 
ORDER BY dashboard_district.name
 ;
