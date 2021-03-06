select si.Date,
round((dp.Volume/si.Days)/1000,1) as [Deep Panuke],
round((si.Volume/si.Days)/1000,1) as [Sable Island]
from (SELECT [Date],Product,sum(Volume) as [Volume],Units,
'Deep Panuke' as [Rig] FROM [EnergyData].[dbo].[CNSOPB_DeepPanuke] as dp
where Product = 'Gas Equivalent Volume' group by [Date],[Product],Units) as dp
right join (SELECT [Date],
datediff(day, dateadd(day, 1-day([Date]), [Date]),
dateadd(month, 1, dateadd(day, 1-day([Date]), [Date]))) as [Days],
Product,sum(Volume) as [Volume],Units,'Sable Island' as [Rig] 
FROM [EnergyData].[dbo].[CNSOPB_SableIsland] as si
where Product = 'Gas Equivalent Volume' and Field in ('ALMA', 'NORTH TRIUMPH', 'SOUTH VENTURE', 'THEBAUD', 'VENTURE')
group by [Date],[Product],Units) as si
on dp.Date = si.Date and dp.Product = si.Product and dp.Units = si.Units
where year(si.Date)>='2009' order by si.Date
