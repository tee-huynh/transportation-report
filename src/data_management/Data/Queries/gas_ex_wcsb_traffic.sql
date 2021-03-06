select [Date],
[Alliance Pipeline Limited Partnership - Alliance Pipeline - Border] as [Alliance Pipeline - Border],
[NOVA Gas Transmission Ltd. (NGTL) - NGTL System - East Gate] as [NGTL System - East Gate],
[NOVA Gas Transmission Ltd. (NGTL) - NGTL System - West Gate] as [NGTL System - West Gate],
[Westcoast Energy Inc. - BC Pipeline - Huntingdon Export] + [Westcoast Energy Inc. - BC Pipeline - FortisBC Lower Mainland] as [Westcoast Energy Inc. - BC Pipeline - Huntingdon/Lower Mainland],
[Capacity (1000 m3/d)] as [Capacity]
from (SELECT 
cast(str([Month])+'-'+'1'+'-'+str([Year]) as date) as [Date],
[Corporate Entity]+' - '+[Pipeline Name]+' - '+[Key Point] as [Point],
round(avg(([Throughput (1000 m3/d)]/28316.85)),2) as [value]
FROM [EnergyData].[dbo].[Pipelines_Gas] where 
([Year] >= '2015' and [Corporate Entity] = 'Alliance Pipeline Limited Partnership' and [Key Point] = 'Border') or
([Year] >= '2015' and [Corporate Entity] = 'Westcoast Energy Inc.' and [Key Point] = 'Huntingdon Export') or
([Year] >= '2015' and [Corporate Entity] = 'Westcoast Energy Inc.' and [Key Point] = 'FortisBC Lower Mainland') or
([Year] >= '2015' and [Corporate Entity] = 'NOVA Gas Transmission Ltd. (NGTL)' and [Key Point] in ('East Gate','West Gate')) 
group by [Year], [Month], [Corporate Entity], [Pipeline Name], [Key Point], [Trade Type]
union all
select [Date], 'Capacity (1000 m3/d)' as [Point], round(sum([Capacity (1000 m3/d)]/28316.85),2) as [value]
from (SELECT cast(str([Month])+'-'+'1'+'-'+str([Year]) as date) as [Date],[Corporate Entity],[Pipeline Name], [Key Point],
round(avg([Capacity (1000 m3/d)]),1) as [Capacity (1000 m3/d)]
FROM [EnergyData].[dbo].[Pipelines_Gas] where
([Year] >= '2015' and [Corporate Entity] = 'Alliance Pipeline Limited Partnership' and [Key Point] = 'Border') or
([Year] >= '2015' and [Corporate Entity] = 'Westcoast Energy Inc.' and [Key Point] = 'Huntingdon Export') or
([Year] >= '2015' and [Corporate Entity] = 'NOVA Gas Transmission Ltd. (NGTL)' and [Key Point] in ('East Gate','West Gate')) 
group by [Year],[Month],[Corporate Entity],[Pipeline Name], [Key Point]
) as gas_cap group by [Date]) as SourceTable
pivot (avg([value])
for Point in ([Alliance Pipeline Limited Partnership - Alliance Pipeline - Border],
[NOVA Gas Transmission Ltd. (NGTL) - NGTL System - East Gate],
[NOVA Gas Transmission Ltd. (NGTL) - NGTL System - West Gate],
[TransCanada PipeLines Limited - Canadian Mainline - Prairies],
[Westcoast Energy Inc. - BC Pipeline - Huntingdon Export],
[Westcoast Energy Inc. - BC Pipeline - FortisBC Lower Mainland],
[Capacity (1000 m3/d)])
) as PivotTable order by [Date]