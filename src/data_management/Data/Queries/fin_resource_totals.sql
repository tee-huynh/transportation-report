SELECT 
[variable] as [Financial Instrument],
left([All Class], CHARINDEX(' ',[ALL Class])) as [Commodity],
count(distinct [Company]) as [Companies using Financial Instrument],
sum([values]) as [Financial Instrument Total]
FROM [EnergyData].[dbo].[Pipeline_Fin_Resource]
where variable <> 'ALL Limit' and left([All Class], CHARINDEX(' ',[ALL Class])) not in ('Commodity','CO2')
group by [variable], left([All Class], CHARINDEX(' ',[ALL Class]))
--order by left([All Class], CHARINDEX(' ',[ALL Class])), count(distinct [Company]) desc
union all
SELECT 
[variable] as [Financial Instrument],
'All' as [Commodity],
count(distinct [Company]) as [Companies using Financial Instrument],
sum([values]) as [Financial Instrument Total]
FROM [EnergyData].[dbo].[Pipeline_Fin_Resource]
where variable <> 'ALL Limit' and left([All Class], CHARINDEX(' ',[ALL Class])) not in ('Commodity','CO2')
group by [variable]
order by left([All Class], CHARINDEX(' ',[ALL Class])), count(distinct [Company]) desc
