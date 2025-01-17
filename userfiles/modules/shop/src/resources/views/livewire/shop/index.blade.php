<div>

    <h1>Shop</h1>

    <div class="d-flex justify-content-between">
        <div>
            <label>Search</label>
            <input type="text" class="form-control" wire:model="keywords" placeholder="Type to search...">
        </div>
        <div class="d-flex gap-2">
            <div>
                <label>Sort</label>
                <div>
                    <select class="form-control">
                        <option wire:click="filterSort('created_by', 'asc')">Newest</option>
                        <option wire:click="filterSort('created_by', 'desc')">Oldest</option>
                        <option wire:click="filterSort('title', 'asc')">Title: A-Z</option>
                        <option wire:click="filterSort('title', 'desc')">Title: Z-A</option>
                        <option wire:click="filterSort('price', 'asc')">Price: Low to High</option>
                        <option wire:click="filterSort('price', 'desc')">Price: High to Low</option>
                    </select>
                </div>
            </div>
            <div>
                <label>Limit</label>
                <div>
                    <select class="form-control">
                        <option wire:click="filterLimit(1)">1</option>
                        <option wire:click="filterLimit(12)">12</option>
                        <option wire:click="filterLimit(24)">24</option>
                        <option wire:click="filterLimit(48)">48</option>
                        <option wire:click="filterLimit(96)">96</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    @if(!empty($availableTags))
        <div class="mt-2">
            <label>Tags</label>
            @foreach($availableTags as $tagSlug=>$tagName)
                <button type="button" class="btn btn-outline-primary btn-sm">
                     <span wire:click="filterTag('{{$tagSlug}}')"> {{$tagName}}</span>
                    @if(in_array($tagSlug, $filteredTags))
                        <span wire:click="filterRemoveTag('{{$tagSlug}}')">
                            X
                        </span>
                    @endif
                </button>
            @endforeach
            <button type="button" wire:click="filterClearTags()" class="btn btn-outline-danger btn-sm">
                Clear All
            </button>
        </div>
    @endif

    <div class="row mt-4">
        @foreach($products as $product)

            <div class="col-xl-4 col-lg-6 col-sm-12 mb-5">
                <a class="text-decoration-none" href="{{content_link($product->id)}}">
                    <div class="img-as-background square-75 h-350 position-relative">

                        <div @if($product->getContentDataByFieldName('label-color'))
                             style="background-color: {{$product->getContentDataByFieldName('label-color')}} "
                            @endif >
                            @if($product->getContentDataByFieldName('label-type') == 'percent')
                                <div class="discount-label">
                                                <span class="discount-percentage">
                                                      {{$product->getDiscountPercentage()}} %
                                                </span>
                                    <span class="discount-label-text"><?php _lang("Discount"); ?></span>
                                </div>

                            @endif
                            @if($product->getContentDataByFieldName('label-type') == 'text' and $product->getContentDataByFieldName('label'))

                                <div class="position-absolute  top-0 left-0 m-2" style="z-index: 3;">
                                    <div class="badge text-white px-3 pb-1 pt-2 rounded-0" style="background-color: {{$product->getContentDataByFieldName('label-color')}};">{{$product->getContentDataByFieldName('label')}}</div>
                                </div>
                            @endif
                        </div>

                        <img src="{{$product->thumbnail(1000,1000)}}" />

                    </div>
                    <h6 class="mt-3">{{$product->title}}</h6>
                </a>


                <p>{{$product->content_text}}</p>




                <div class="d-flex align-items-center price-holder">

                    @if($product->hasSpecialPrice())
                        <h6 class="price-old mb-0"><?php print currency_format($product->price); ?></h6>
                        <h6 class="price mb-0"><?php print currency_format($product->specialPrice); ?></h6>
                    @else
                        <h6 class="price mb-0"><?php print currency_format($product->price); ?></h6>
                    @endif


                </div>

                @foreach($product->tags as $tag)
                <span class="badge badge-lg"><a href="?tags[]={{$tag->slug}}">{{$tag->name}}</a></span>
                @endforeach
            </div>
        @endforeach
    </div>

    <div class="d-flex justify-content-center mb-3">
        {{ $products->links("livewire-tables::specific.bootstrap-4.pagination") }}
    </div>

</div>
