select 
year([Month]) as [Year],
units,
round(avg([Value]),2) as [Production],
Region

from
(

SELECT 
[Month],
[Units],
sum([Value]) as [Value],
case when [Province] in ('AB','BC','NWT','SK','MB') then 'WCSB'
when [Province] in ('NB','NS','NL') then 'Eastern Canada'
when [Province] in ('Canada') then 'Canada'
else 'Other' 
end as [Region]

FROM [EnergyData].[dbo].[NEB_Production_Oil]
where Units = 'barrels per day' and year([Month]) = '2019'

group by [Month],
[Units],
case when [Province] in ('AB','BC','NWT','SK','MB') then 'WCSB'
when [Province] in ('NB','NS','NL') then 'Eastern Canada'
when [Province] in ('Canada') then 'Canada'
else 'Other' 
end
--order by [Month]
) as cer_oil

where Region <> 'Other'
group by year([Month]),Units,Region


--select distinct [Province] FROM [EnergyData].[dbo].[NEB_Production_Oil]

