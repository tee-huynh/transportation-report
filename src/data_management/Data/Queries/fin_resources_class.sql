SELECT 
fin.[ALL Class] as [Pipeline Group],
left([All Class], CHARINDEX(' ',[ALL Class])) as [Commodity],
sum(fin.[values]) as [Financial Resource]
FROM [EnergyData].[dbo].[Pipeline_Fin_Resource] as fin
where variable = 'ALL Limit' and [ALL Class] not in ('CO2 or Water Class','Commodity class 1')
group by fin.[ALL Class]
order by left([All Class], CHARINDEX(' ',[ALL Class])) desc, sum(fin.[values]) desc
