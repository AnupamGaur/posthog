import React, { CSSProperties } from 'react'
import { useValues, BindLogic, useActions } from 'kea'
import { propertyFilterLogic } from './propertyFilterLogic'
import { FilterRow } from './components/FilterRow'
import '../../../scenes/actions/Actions.scss'
import { TooltipPlacement } from 'antd/lib/tooltip'
import { AnyPropertyFilter } from '~/types'
import { TaxonomicFilterGroupType } from 'lib/components/TaxonomicFilter/types'
import { Placement } from '@popperjs/core'
import { PropertyFilter } from '.'
import { ButtonType } from 'antd/lib/button'

interface PropertyFiltersProps {
    endpoint?: string | null
    propertyFilters?: AnyPropertyFilter[] | null
    onChange?: null | ((filters: AnyPropertyFilter[]) => void)
    pageKey: string
    showConditionBadge?: boolean
    disablePopover?: boolean
    popoverPlacement?: TooltipPlacement | null
    taxonomicPopoverPlacement?: Placement
    style?: CSSProperties
    taxonomicGroupTypes?: TaxonomicFilterGroupType[]
    showNestedArrow?: boolean
    addButtonType?: ButtonType
    greyBadges?: boolean
}

export function PropertyFilters({
    propertyFilters = null,
    onChange = null,
    pageKey,
    showConditionBadge = false,
    disablePopover = false, // use bare PropertyFilter without popover
    popoverPlacement = null,
    taxonomicPopoverPlacement = undefined,
    taxonomicGroupTypes,
    style = {},
    showNestedArrow = false,
    addButtonType = 'link',
    greyBadges = false,
}: PropertyFiltersProps): JSX.Element {
    const logicProps = { propertyFilters, onChange, pageKey }
    const { filters } = useValues(propertyFilterLogic(logicProps))
    const { remove } = useActions(propertyFilterLogic(logicProps))

    return (
        <div className="mb" style={style}>
            <BindLogic logic={propertyFilterLogic} props={logicProps}>
                {filters?.length &&
                    filters.map((item, index) => {
                        return (
                            <FilterRow
                                key={index}
                                item={item}
                                index={index}
                                totalCount={filters.length - 1} // empty state
                                filters={filters}
                                pageKey={pageKey}
                                showConditionBadge={showConditionBadge}
                                disablePopover={disablePopover}
                                popoverPlacement={popoverPlacement}
                                taxonomicPopoverPlacement={taxonomicPopoverPlacement}
                                showNestedArrow={showNestedArrow}
                                label={'Add filter'}
                                addButtonType={addButtonType}
                                onRemove={remove}
                                greyBadges={greyBadges}
                                filterComponent={(onComplete) => {
                                    const propertyFilterCommonProps = {
                                        key: index,
                                        pageKey,
                                        index,
                                        onComplete,
                                        selectProps: {},
                                        taxonomicGroupTypes,
                                    }
                                    return (
                                        <PropertyFilter
                                            {...propertyFilterCommonProps}
                                            disablePopover={disablePopover}
                                            selectProps={{
                                                delayBeforeAutoOpen: 150,
                                                placement: pageKey === 'trends-filters' ? 'bottomLeft' : undefined,
                                            }}
                                        />
                                    )
                                }}
                            />
                        )
                    })}
            </BindLogic>
        </div>
    )
}
