SELECT
cast(str(month([SettlementDate]))+'-'+'1'+'-'+str(year([SettlementDate])) as date) as [Date], 
round(avg([SettlementPriceImplied]),1) as [WCS],
round(avg([WTI Spot]),1) as [WTI]
FROM [EnergyData].[dbo].[vw_net_energy_and_eia_prices]
where Market = 'WCS' and year([SettlementDate]) >= 2015
group by year([SettlementDate]), month([SettlementDate])
order by cast(str(month([SettlementDate]))+'-'+'1'+'-'+str(year([SettlementDate])) as date)